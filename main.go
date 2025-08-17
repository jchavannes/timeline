package main

import (
	"crypto/rand"
	"encoding/hex"
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

	necessaryRoute = web.Route{
		Pattern: "/necessary",
		Handler: func(r *web.Response) {
			r.Helper["OnlyNecessary"] = true
			r.Helper["Events"] = getEvents()
			r.RenderTemplate("index")
		},
	}

	aboutRoute = web.Route{
		Pattern: "/about",
		Handler: func(r *web.Response) {
			r.Render()
		},
	}
)

var CacheBuster string

func init() {
	b := make([]byte, 3)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	CacheBuster = hex.EncodeToString(b)
}

func main() {
	server := web.Server{
		Port:           2040,
		TemplatesDir:   "web",
		StaticFilesDir: "web",
		PreHandler: func(r *web.Response) {
			r.Helper["CacheBuster"] = CacheBuster
		},
		Routes: []web.Route{
			indexRoute,
			necessaryRoute,
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
	Name      string
	Necessary bool
	Actual    int64
	Label     string
	Source    string
	Image     struct {
		Name   string
		Link   string
		Width  string
		Height string
	}
}

func (e event) GetSourceText() string {
	if !wikipedia.IsWikipediaUrl(e.Source) {
		return e.Source
	}
	return "wiki/" + wikipedia.ArticleNameFromUrl(e.Source)
}

func check(e error) {
	if e != nil {
		log.Fatal(e)
	}
}
