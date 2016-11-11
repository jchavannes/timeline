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
		Window window
		Events []event
	}
}

func converterUniverseTimeToCosmicCalendar(t int) string {
	unixMin := float32(1420070400)
	unixMax := float32(1451606399)
	universeMax := float32(13820000000)
	seconds := ((universeMax - float32(t)) / universeMax) * (unixMax - unixMin)
	unixTs := unixMin + seconds + 28800
	return time.Unix(int64(unixTs), 0).String()
}

const port = 2040

func main() {
	data, err := ioutil.ReadFile("events.yml")
	check(err)

	e := events{}
	err = yaml.Unmarshal(data, &e)
	check(err)

	fmt.Printf("Starting timeline web server on port %d\n", port)

	// Requests
	server := http.NewServeMux()
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
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