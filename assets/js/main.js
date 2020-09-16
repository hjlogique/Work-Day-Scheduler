/* ==============================
   Daily Work Scheduler - main.js
   ============================== */

// Do the followings once Document is loaded
$(document).ready(function () {
    updateEverySec(); // Display and update the time every second
    $(".container").on("click", ".saveBtn", saveInfo); // Save changes once Save buttons are clicked
    runScheduler(); // Generate, clear, save and update the time blocks
});

function updateEverySec() {
    $("#currentDay").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    setTimeout(updateEverySec, 1000);
}

var startHour = 7, endHour = 19; // Working Hours (7AM - 7PM)
var container = $(".container");
var updateTimeBlocks = 10000; // Timer to update time blocks every 10 sec
var updateInterval;
var today = moment().clone(); // Today as the current date


// Save time blocks' info in the local storage
function saveInfo() {
    var saveInfo = $(this).siblings(".description");
    var hour = saveInfo.attr("hourVal");
    var description = saveInfo.val();
    localStorage.setItem(today.format("YYYYMMDD-") + hour.trim(), description.trim());
}

// Generate, clear and update time blocks
function runScheduler() {

    clearInterval(updateInterval);

    // Clear time blocks' Info
    $(".container").html("");

    // Create time blocks dynamically using Bootstrap components
    for (var i = startHour; i < endHour + 2; i++) {

        $(".container").append(timeBlock);
        var timeBlock = generateElement("div", "time-block");

        var row = generateElement("div", "row");
        timeBlock.appendChild(row);

        var hourColumn = generateElement("div", "col-sm-1 col-12 pt-3 hour", i);
        row.appendChild(hourColumn);

        var descriptionColumn = generateElement("textarea", "col-sm-10 col-12 description", i);
        row.appendChild(descriptionColumn);

        var saveColumn = generateElement("div", "col-sm-1 col-12 saveBtn");
        row.appendChild(saveColumn);

        var saveIcon = generateElement("i", "far fa-save");
        saveColumn.appendChild(saveIcon);
    }

    // Update time blocks' info every 10 sec
    updateInterval = setInterval(timeBlocksTensesChanged, updateTimeBlocks);
}

// Verify if the tenses of the time block's are changed, and change
// the tense classes of their descriptions accordingly
function timeBlocksTensesChanged() {

    var descriptions = $('.description');

    descriptions.each(function () {

        var workHour = $(this).attr("hourVal"); // 12 - hour format
        var t = moment(today.format("YYYYMMDD ") + workHour, "YYYYMMDD hA");
        var tenseClass = findTense(t); // Current tense

        if ($(this).hasClass(tenseClass)) {
        } else if (tenseClass === "present") {
            $(this).removeClass("past future");
        } else if (tenseClass === "past") {
            $(this).removeClass("present future");
        } else if (tenseClass === "future") {
            $(this).removeClass("past present");
        } else {
            alert("Unknown Tense");
        }
        $(this).addClass(tenseClass);
    });
}

// Generate hour and description elements and verify their tenses
function generateElement(elementType, elementClass, workHour) {

    var newElement = document.createElement(elementType);

    // Reformat 24-hour format to 12-hour format after 12 PM
    if (workHour) { // 24 - hour format
        var t = moment(today.format("YYYYMMDD ") + workHour, "YYYYMMDD H");
        var displayHour = t.format("h A");

        if (elementClass.includes("description")) {   // Element with description class
            elementClass += " " + findTense(t);
            newElement.textContent = localStorage.getItem(today.format("YYYYMMDD-") + displayHour);
            newElement.setAttribute("hourVal", displayHour);

        } else {
            newElement.textContent = displayHour.padEnd(7, " "); // Element with hour class
        }
    }
    // Set the classes on the element
    newElement.setAttribute("class", elementClass);

    return newElement;
}

// Find the tense of a time block by Comparing its time with the today's date
function findTense(t) {

    var tenseClass;
    var m = moment();

    // Momentjs isSame function
    if (m.isSame(t, "hour") && m.isSame(t, "day") && m.isSame(t, "month") && m.isSame(t, "year")) {
        tenseClass = "present";
    } else if (m.isAfter(t)) {
        tenseClass = "past"
    } else {
        tenseClass = "future";
    }
    return tenseClass;
}
