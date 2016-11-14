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
        $timelines.append(
            "<div class='timeline-1'>" +
            "<h2>" + timeline.Name + "</h2>" +
            "<div class='main'>" +
            "</div>" +
            "</div>"
        );
        $timelines.find('.main').append(
            "<div class='line'></div>" +
            "<div class='events'></div>"
        );
        var $events = $timelines.find('.events');
        for (var j = 0; j < timeline.Events.length; j++) {
            var event = timeline.Events[j];

            var width1 = "70px";
            var top1 = "0";
            var height1 = "10px";

            var width2 = "30px";
            var left2 = "-30px";
            var top2 = "7px";

            $events.append(
                "<div class='event'>" +
                "<div class='bar1' style='width:" + width1 + ";height:" + height1 + ";top:" + top1 + "'></div>" +
                "<div class='bar2' style='width:" + width2 + ";top:" + top2 + ";left:" + left2 + "'></div>" +
                "<p><b>" + event.Label + ":</b> " + event.Name + "</p>" +
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