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

/**
 * @param timelines {[Timeline]}
 */
function createTimelines(timelines) {
    var $timelines = $('#timelines-new');
    for (var i = 0; i < timelines.length; i++) {
        var timeline = timelines[i];
        var timelineId = "timeline-" + i;
        $timelines.append(
            "<div id='" + timelineId + "'>" +
            "<h2>" + timeline.Name + "</h2>" +
            "<div class='main'>" +
            "</div>" +
            "</div>"
        );
        var $timeline = $timelines.find("#" + timelineId);
        $timeline.find('.main').append(
            "<div class='line'></div>" +
            "<div class='events'></div>"
        );
        var $events = $timeline.find('.events');
        var maxTime = timeline.Start;

        var width = 90;
        var previousEventTop = -20;
        var previousTextTop = -20;
        var previousEventCollisions = 0;
        for (var j = 0; j < timeline.Events.length; j++) {
            var event = timeline.Events[j];

            var eventTop = (maxTime - event.YearsAgo) / maxTime * 1000;
            var textTop = previousTextTop + 20;
            var eventCollisions = 0;

            if (eventTop < previousEventTop + 20) {
                if (parseInt(previousEventTop) != parseInt(eventTop)) {
                    eventCollisions++;
                }
            } else {
                eventCollisions = 0;
                textTop = eventTop;
            }

            var bar1width = (width - (eventCollisions * 8)) + "px";
            var bar1top = eventTop + "px";
            var bar1height = (eventTop - textTop + 9) + "px";

            var bar2width = (100 - width + (eventCollisions * 8)) + "px";
            var bar2left = "-" + (100 - width + (eventCollisions * 8)) + "px";
            var bar2top = (textTop > eventTop) ? (eventTop + 7) + "px" : textTop + "px";

            var textTopPx = (textTop > eventTop) ? (eventTop - 1) + "px" : (textTop - 8) + "px";

            previousEventTop = eventTop;
            previousTextTop = textTop;
            previousEventCollisions = eventCollisions;

            $events.append(
                "<div class='event'>" +
                "<div class='bar1' style='width:" + bar1width + ";height:" + bar1height + ";top:" + bar1top + "'></div>" +
                "<div class='bar2' style='width:" + bar2width + ";top:" + bar2top + ";left:" + bar2left + "'></div>" +
                "<div class='text' style='top:" + textTopPx + "'>" +
                "<p><b>" + event.Label + ":</b> " + event.Name + "</p>" +
                "</div>" +
                "</div>"
            );
        }
    }
}


/**
 Event height: 20

 Event 1:
 - Loc: 0
 - Actual: 10
 Event 2:
 - Loc: 0
 - Actual: 30
 Event 3:
 - Loc: 1
 - Actual: 50
 Event 4:
 - Loc 10:
 - Actual: 60

 Event 5:
 - Loc: 400
 - Actual: 400

 Event 6:
 - Loc: 700
 - Actual: 700
 Event 7:
 - Loc: 710
 - Actual: 720 (optimized would be 695, 715)
 Event 8:
 - Loc: 715
 - Actual: 740 (optimized would be 688, 708, 728)

 Event 9:
 - Loc: 910
 - Actual: 910
 Event 10:
 - Loc: 915
 - Actual: 930 (avoiding bottom would be 903, 923)
 Event 11:
 - Loc: 920
 - Actual: 950 (avoiding bottom would be 883, 903, 923)


 Logic:
 - First pass: assign actuals based on location (ignoring all boundaries, collisions, etc)
 - Second pass: naively fix collisions by moving subsequent events down, including top boundary (e.g. events 1/2 above)
 - Third pass: check for events outside of bottom boundary and move up all collided events (e.g. events 10/11 above)
 - Fourth pass: for events collided, optimize placement (e.g. event 7/8 above)?


 Actuals:
 Min: 10
 Max: 923 (last 67 is for spill over [1/15th], plus 10 for padding)
 */