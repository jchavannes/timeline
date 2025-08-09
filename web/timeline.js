var eraCounter = 0;
var eraNavItems = [];

function timeline(eraName, eraLabel, eraData, $timeline) {
    var eraId = "era-" + eraCounter++;
    eraNavItems.push({id: eraId, name: eraName, label: eraLabel});
    var appendText = "<div class='timeline-era' id='" + eraId + "'><h4>" + eraName + " <br/><div class='era-time'>" + eraLabel + "</div></h4><ul>";
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
                "</a><br/>";
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
    appendText += "</ul></div>";
    $timeline.append(appendText);
}

function buildEraNavigation() {
    if (eraNavItems.length === 0) return;

    var navHtml = '<div class="era-navigation"><div class="era-nav-header">Quick Navigation</div><ul class="era-nav-list">';
    for (var i = 0; i < eraNavItems.length; i++) {
        var era = eraNavItems[i];
        navHtml += '<li><a href="#' + era.id + '" data-era-id="' + era.id + '">' +
            '<span class="era-nav-name">' + era.name + '</span>' +
            '<span class="era-nav-label">' + era.label + '</span></a></li>';
    }
    navHtml += '</ul></div>';

    $('body').append(navHtml);

    // Smooth scrolling
    $('.era-nav-list a').click(function (e) {
        e.preventDefault();
        var target = $(this).attr('href');
        var offset = $(target).offset().top - 80;
        $('html, body').animate({
            scrollTop: offset
        }, 500);
    });

    // Update active state on scroll
    $(window).scroll(function () {
        var scrollPos = $(window).scrollTop() + 100;
        $('.timeline-era').each(function () {
            var currEra = $(this);
            var currEraId = currEra.attr('id');
            if (currEra.offset().top <= scrollPos && currEra.offset().top + currEra.height() > scrollPos) {
                $('.era-nav-list a').removeClass('active');
                $('.era-nav-list a[data-era-id="' + currEraId + '"]').addClass('active');
            }
        });
    });
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
