/*=========================================
FOOTER YEAR
=========================================*/

document.getElementById("year").textContent = new Date().getFullYear();

/*=========================================
STICKY HEADER
=========================================*/

const header = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/*=========================================
MOBILE MENU
=========================================*/

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("active");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

});

mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");

    });

});

/*=========================================
ACTIVE NAV LINK ON SCROLL
=========================================*/

const navLinks = document.querySelectorAll("#mainNav a");
const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function updateActiveNav() {

    let currentId = sections[0] ? sections[0].id : null;

    sections.forEach(section => {

        if (window.scrollY >= section.offsetTop - 160) {

            currentId = section.id;

        }

    });

    navLinks.forEach(link => {

        link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);

    });

}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

/*=========================================
SCROLL REVEAL
=========================================*/

const revealTargets = document.querySelectorAll(
    ".member-card, .achieve-card, .gallery-item, .value, .tree-node"
);

revealTargets.forEach(el => el.classList.add("reveal"));

function revealOnScroll() {

    const visible = window.innerHeight - 90;

    revealTargets.forEach(el => {

        if (el.getBoundingClientRect().top < visible) {

            el.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/*=========================================
FAMILY TREE -> MEET THE FAMILY LINKING
=========================================*/

const treeNodes = document.querySelectorAll(".tree-node");

treeNodes.forEach(node => {

    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");

    const goToMember = () => {

        const memberId = node.dataset.member;
        const card = document.getElementById(`member-${memberId}`);

        if (!card) return;

        treeNodes.forEach(n => n.classList.remove("selected"));
        node.classList.add("selected");

        card.scrollIntoView({ behavior: "smooth", block: "center" });

        document.querySelectorAll(".member-card").forEach(c => c.classList.remove("highlight"));
        card.classList.add("highlight");

        setTimeout(() => card.classList.remove("highlight"), 2200);

    };

    node.addEventListener("click", goToMember);

    node.addEventListener("keydown", (e) => {

        if (e.key === "Enter" || e.key === " ") {

            e.preventDefault();
            goToMember();

        }

    });

});

/*=========================================
GALLERY LIGHTBOX
=========================================*/

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item").forEach(item => {

    item.addEventListener("click", () => {

        const img = item.querySelector("img");

        if (item.classList.contains("no-photo") || !img || img.style.display === "none") {

            return;

        }

        lightbox.classList.add("show");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = item.dataset.caption || "";
        document.body.style.overflow = "hidden";

    });

});

function closeLightbox() {

    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";

}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) closeLightbox();

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") closeLightbox();

});

/*=========================================
EVENTS CALENDAR
=========================================*/

/* Replace/add your own events here. Month is 0-indexed (0 = January). */

const familyEvents = [
    { date: new Date(2026, 8, 15), title: "William's Birthday" },
    { date: new Date(2026, 5, 20), title: "Edna's Birthday" },
    { date: new Date(2026, 8, 6), title: "Dorothy's Birthday" },
    { date: new Date(2026, 6, 13), title: "Fiona's Birthday" },
    { date: new Date(2026, 4, 22), title: "William & Edna's Anniversary",}
];

const calMonthLabel = document.getElementById("calMonthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const upcomingEventsEl = document.getElementById("upcomingEvents");
const calPrev = document.getElementById("calPrev");
const calNext = document.getElementById("calNext");

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();

const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function eventsOnDate(year, month, day) {

    return familyEvents.filter(ev =>
        ev.date.getFullYear() === year &&
        ev.date.getMonth() === month &&
        ev.date.getDate() === day
    );

}

function renderCalendar() {

    calMonthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    calendarGrid.innerHTML = "";

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("span");
        empty.className = "cal-day empty";
        calendarGrid.appendChild(empty);

    }

    for (let day = 1; day <= daysInMonth; day++) {

        const cell = document.createElement("span");
        cell.className = "cal-day";
        cell.textContent = day;

        const dayEvents = eventsOnDate(viewYear, viewMonth, day);

        if (dayEvents.length > 0) {

            cell.classList.add("has-event");
            cell.title = dayEvents.map(e => e.title).join(", ");

            cell.addEventListener("click", () => {

                alert(dayEvents.map(e => `${e.title}\n${e.note}`).join("\n\n"));

            });

        }

        if (
            viewYear === today.getFullYear() &&
            viewMonth === today.getMonth() &&
            day === today.getDate()
        ) {

            cell.classList.add("today");

        }

        calendarGrid.appendChild(cell);

    }

}

function renderUpcoming() {

    const upcoming = familyEvents
        .filter(ev => ev.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
        .sort((a, b) => a.date - b.date);

    upcomingEventsEl.innerHTML = "";

    if (upcoming.length === 0) {

        upcomingEventsEl.innerHTML = "<p>No upcoming events yet — add some in script.js.</p>";
        return;

    }

    upcoming.forEach(ev => {

        const row = document.createElement("div");
        row.className = "event-row";

        const dateStr = ev.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        row.innerHTML = `
            <div class="event-date">${dateStr}</div>
            <div class="event-info">
                <h4>${ev.title}</h4>
                <p>${ev.note}</p>
            </div>
        `;

        upcomingEventsEl.appendChild(row);

    });

}

calPrev.addEventListener("click", () => {

    viewMonth--;

    if (viewMonth < 0) {

        viewMonth = 11;
        viewYear--;

    }

    renderCalendar();

});

calNext.addEventListener("click", () => {

    viewMonth++;

    if (viewMonth > 11) {

        viewMonth = 0;
        viewYear++;

    }

    renderCalendar();

});

renderCalendar();
renderUpcoming();
