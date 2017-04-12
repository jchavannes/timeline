package main

import (
	"github.com/jchavannes/jgo/web"
	"gopkg.in/yaml.v2"
	"log"
	"io/ioutil"
	"github.com/jchavannes/browser-history-parser/wikipedia"
)

type event struct {
	Name   string
	Actual int64
	Label  string
	Source string
}

func (e event) GetSourceText() string {
	if ! wikipedia.IsWikipediaUrl(e.Source) {
		return e.Source
	}
	return "wiki/" + wikipedia.ArticleNameFromUrl(e.Source)
}

type era struct {
	Name    string
	Label   string
	Events  []event
}

type events struct {
	Eras []era
}

var (
	indexRoute = web.Route{
		Pattern: "/",
		Handler: func(r *web.Response) {
			r.Helper["Events"] = getEvents()
			r.Render()
		},
	}

	getEvents = func () events {
		data, err := ioutil.ReadFile("events.yml")
		check(err)
		e := events{}
		err = yaml.Unmarshal(data, &e)
		check(err)
		return e
	}
)

func main() {
	server := web.Server{
		Port: 2040,
		TemplatesDir: "web",
		StaticFilesDir: "web",
		Routes: []web.Route{
			indexRoute,
		},
	}
	server.Run()
}

func check(e error) {
	if e != nil {
		log.Fatal(e)
	}
}
