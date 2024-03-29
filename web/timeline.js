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
            if (event.source.substr(0, 4) === "http") {
                sourceHtml = " <a target='_blank' href='" + event.source + "'>[" + event.sourceText + "]</a>";
            } else {
                sourceHtml = " <i>[" + event.sourceText + "]</i>";
            }
            sourceHtml = "<span>" + sourceHtml + "</span>";
        }
        var imgHtml = "";
        if (event.image.length > 0) {
            var imgUrl = "img/" + event.image;
            var imgLink = imgUrl;
            if (event.imageLink.length > 0) {
                imgLink = event.imageLink;
            }
            var imageWidth = event.imageWidth > 0 ? event.imageWidth : 100;
            var imageHeight = event.imageHeight;
            var desiredWidth = 250;
            var factor = desiredWidth / imageWidth;
            imageWidth = imageWidth * factor;
            imageHeight = imageHeight > 0 ? imageHeight * factor : "";
            imgHtml =
                "<a target='_blank' href='" + imgLink + "'>" +
                "<img src='" + imgUrl + "' width='" + imageWidth + "' height='" + imageHeight + "' />" +
                "</a>";
        }
        appendText +=
            "<li>" +
            imgHtml +
            event.content +
            "<br/>" +
            sourceHtml +
            "<div style='clear:both;'></div>" +
            "</li>";
    }
    appendText += "</ul><hr/>";
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
