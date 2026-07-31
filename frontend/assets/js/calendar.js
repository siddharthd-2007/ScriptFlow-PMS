let currentDate = new Date();
let tasks = [];

async function loadTasks() {

    try {

        tasks = await apiRequest("/calendar/");

        renderCalendar();

    }

    catch (error) {

        console.error(error);

    }

}

function renderCalendar(){

    const monthYear =
        document.getElementById("monthYear");

    const calendar =
    document.getElementById("calendarGrid");

    calendar.innerHTML = `
    <div class="day-name">Sun</div>
    <div class="day-name">Mon</div>
    <div class="day-name">Tue</div>
    <div class="day-name">Wed</div>
    <div class="day-name">Thu</div>
    <div class="day-name">Fri</div>
    <div class="day-name">Sat</div>
`;

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    monthYear.textContent =
        currentDate.toLocaleString("default",{

            month:"long",

            year:"numeric"

        });

    for(let i=0;i<firstDay;i++){

        calendar.innerHTML +=
            `<div></div>`;

    }

    for(let day=1;day<=daysInMonth;day++){

        const dateString =
`${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

const dayTasks = tasks.filter(task =>
    task.date === dateString
);

calendar.innerHTML += `

<div class="calendar-day">

    <div class="day-number">

        ${day}

    </div>

    ${dayTasks.map(task => `

    <div
        class="task-chip ${getEventClass(task.type)}"
        data-url="${task.url}">

        ${task.title}

    </div>

`).join("")}

</div>

`;

    }

}

renderCalendar();
document.getElementById("prevMonth")
.addEventListener("click",()=>{

    currentDate.setMonth(
        currentDate.getMonth()-1
    );

    renderCalendar();

});
document.getElementById("nextMonth")
.addEventListener("click",()=>{

    currentDate.setMonth(
        currentDate.getMonth()+1
    );

    loadTasks();

});

function getEventClass(type) {

    switch (type) {

        case "task":
            return "calendar-task";

        case "project":
            return "calendar-project";

        case "module":
            return "calendar-module";

        default:
            return "";

    }

}