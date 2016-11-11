package main

import (
	"fmt"
	"gitlab.wantlistapp.com/app/jgo/site"
	"gopkg.in/yaml.v2"
	"log"
	"net/http"
	"strconv"
	"io/ioutil"
	"time"
)

type event struct {
	Name   string
	Actual int
	Label  string
}

func (e event) GetDate() string {
	return converterUniverseTimeToCosmicCalendar(e.Actual)
}

type window struct {
	Min int
	Max int
}

func (w window) GetStart() string {
	return converterUniverseTimeToCosmicCalendar(w.Min)
}

func (w window) GetEnd() string {
	return converterUniverseTimeToCosmicCalendar(w.Max)
}

type events struct {
	Eras []struct {
		Name   string
		Label  string
		Window window
		Events []event
	}
}

func converterUniverseTimeToCosmicCalendar(t int) string {
	unixMin := float64(1420070400) // 2015-01-01 00:00:00
	unixMax := float64(1451606399) // 2015-12-31 23:59:59
	universeMax := float64(13820000000) // 13.82 billion years

	seconds := ((universeMax - float64(t)) / universeMax) * (unixMax - unixMin)
	unixTs := unixMin + seconds + 28800 // Offset for PST

	return time.Unix(int64(unixTs), 0).String()
}

const port = 2040

func main() {
	fmt.Printf("Starting timeline web server on port %d\n", port)

	// Requests
	server := http.NewServeMux()
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		data, err := ioutil.ReadFile("events.yml")
		check(err)

		e := events{}
		err = yaml.Unmarshal(data, &e)
		check(err)

		renderer, err := site.GetRenderer("templates")
		check(err)

		filename := site.GetFilenameFromRequest(r)
		if len(filename) == 0 {
			filename = "index"
		}

		err = renderer.Render([]string{
			filename + ".html",
		}, w, &e)

		if err != nil {
			/*log.Fatal(err)
			renderer.Render([]string{
				"404.html",
			}, w, nil)*/
		}

		fmt.Printf("Handled request: %#v\n", r.URL)
	})

	// Static assets
	fs := http.FileServer(http.Dir("public"))
	server.Handle("/public/", http.StripPrefix("/public/", fs))

	http.ListenAndServe(":" + strconv.Itoa(port), server)
}

func check(e error) {
	if e != nil {
		log.Fatal(e)
	}
}
