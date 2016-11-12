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
	"math"
)

type event struct {
	Name   string
	Actual int64
	Label  string
}

func (e event) GetDate() string {
	return converterUniverseTimeToCosmicCalendar(e.Actual)
}

type window struct {
	Min int64
	Max int64
}

func (w window) GetStart() string {
	return converterUniverseTimeToCosmicCalendar(w.Min)
}

func (w window) GetEnd() string {
	return converterUniverseTimeToCosmicCalendar(w.Max)
}

type period struct {
	Name string
	Min  int64
	Max  int64
}

func (p period) GetStart() string {
	return converterUniverseTimeToCosmicCalendar(p.Min)
}

func (p period) GetEnd() string {
	return converterUniverseTimeToCosmicCalendar(p.Max)
}

type era struct {
	Name    string
	Label   string
	Window  window
	Periods []period
	Events  []event
}

type events struct {
	Eras []era
}

func converterUniverseTimeToCosmicCalendar(t int64) string {
	unixMin := float64(1420070400) // 2015-01-01 00:00:00
	unixMax := float64(1451606400) // 2016-01-01 00:00:00
	universeMax := float64(13820000000) // 13.82 billion years

	seconds := ((universeMax - float64(t - 1)) / universeMax) * (unixMax - unixMin)
	unixTs := unixMin + seconds + 28800 // Offset for PST

	sec, dec := math.Modf(unixTs)
	ts := time.Unix(int64(sec), int64(dec * 10e8)).Format("2006-01-02T15:04:05.999999Z07:00")
	fmt.Printf("%#v: %#v (%#v) %#v - %#v ; %#v - %#v)\n", t, ts, unixTs, sec, int64(sec), dec, int64(dec * 10e9))
	return ts
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

		counter := 0
		renderer.SetFuncMap(map[string]interface{}{
			"counter": func() int {
				counter++
				return counter
			},
		})

		filename := site.GetFilenameFromRequest(r)
		if len(filename) == 0 {
			filename = "index"
		}

		err = renderer.Render([]string{
			filename + ".html",
			"404.html",
		}, w, &e)

		if err != nil {
			fmt.Println(err)
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
