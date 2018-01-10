package main

import (
	"github.com/jchavannes/browser-history-parser/wikipedia"
	"github.com/jchavannes/jgo/web"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

var (
	indexRoute = web.Route{
		Pattern: "/",
		Handler: func(r *web.Response) {
			r.Helper["Events"] = getEvents()
			r.Render()
		},
	}

	aboutRoute = web.Route{
		Pattern: "/about",
		Handler: func(r *web.Response) {
			r.Render()
		},
	}
)

func main() {
	server := web.Server{
		Port:           2040,
		TemplatesDir:   "web",
		StaticFilesDir: "web",
		Routes: []web.Route{
			indexRoute,
			aboutRoute,
		},
	}
	server.Run()
}

func getEvents() events {
	data, err := ioutil.ReadFile("events.yml")
	check(err)
	e := events{}
	err = yaml.Unmarshal(data, &e)
	check(err)
	return e
}

type events struct {
	Eras []era
}

type era struct {
	Name   string
	Label  string
	Events []event
}

type event struct {
	Name        string
	Actual      int64
	Label       string
	Source      string
	Image       string
	ImageLink   string `yaml:"image_link"`
	ImageHeight string `yaml:"image_height"`
}

func (e event) GetSourceText() string {
	if ! wikipedia.IsWikipediaUrl(e.Source) {
		return e.Source
	}
	return "wiki/" + wikipedia.ArticleNameFromUrl(e.Source)
}

func check(e error) {
	if e != nil {
		log.Fatal(e)
	}
}
