$(function() {
    var $sources = $(".timeline-body li span");
    switch(true) {
        case (localStorage.sourcesDisplay && localStorage.sourcesDisplay === "hide"):
            hideSources();
            break;
        case (localStorage.sourcesDisplay && localStorage.sourcesDisplay === "show"):
            showSources();
            break;
        default:
            inlineSources();
    }

    function showSources() {
        $sources.css("display", "block");
    }

    function hideSources() {
        $sources.css("display", "none");
    }

    function inlineSources() {
        $sources.css("display", "inline");
    }

    $("#show-sources").click(function() {
        localStorage.sourcesDisplay = "show";
        showSources();
    });

    $("#inline-sources").click(function() {
        localStorage.sourcesDisplay = "inline";
        inlineSources();
    });

    $("#hide-sources").click(function() {
        localStorage.sourcesDisplay = "hide";
        hideSources();
    });

    $("body").show();
});

function timeline(eraName, eraLabel, eraData, $timeline) {
    var appendText = "<h4>" + eraName + " (" + eraLabel + ")</h4><ul>";
    for (var i = 0; i < eraData.length; i++) {
        var event = eraData[i];
        if (event.group === 1) {
            appendText += "<hr/>";
            continue;
        }
        var sourceHtml = "";
        if (event.source.length > 0) {
            if (event.source.substr(0,4) === "http") {
                sourceHtml = " <a href='" + event.source + "'>[" + event.sourceText + "]</a>";
            } else {
                sourceHtml = " <i>[" + event.sourceText + "]</i>";
            }
            sourceHtml = "<span>" + sourceHtml + "</span>";
        }
        appendText += "<li>" + event.content + sourceHtml + "</li>";
    }
    appendText += "</ul>";
    $timeline.append(appendText);
}

/**
 * @typedef {{
 *   Name: string
 *   Label: string
 *   Eras: [Era]
 *   Events: [Event]
 *   Start: float
 *   End: float
 * }} Timeline
 */

/**
 * @typedef {{
 *  Name: string
 *  Color: string
 *  Start: float
 *  End: float
 * }} Era
 */

/**
 * @typedef {{
 *   Name: string
 *   YearsAgo: float
 *   Label: string
 * }} Event
 */
