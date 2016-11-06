package main

import (
	"fmt"
	"gitlab.wantlistapp.com/app/jgo/site"
	"log"
	"net/http"
	"strconv"
)

const port = 2040

func main() {
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
		}, w, nil)

		if err != nil {
			renderer.Render([]string{
				"404.html",
			}, w, nil)
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
