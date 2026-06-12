const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const menuBtn = document.getElementById('menuToggle');
const sideBar = document.getElementById('sidebar');
const form = document.getElementById('bookingForm');
const editEventForm = document.getElementById('editEventForm');
const eventNameInput = document.getElementById('eventName');
const eventTimeInput = document.getElementById('eventTime');
const dashboardGrid = document.querySelector('.dashboard-grid');
const scheduleList = document.querySelector('.schedule-list');

const eventStorageKey = 'eventlyEvents';
const defaultEvents = [
    {
        id: 'tech-summit-2026',
        title: 'Tech Summit 2026',
        dateTime: '2026-06-15T09:00',
        venue: 'Hall A',
    },
    {
        id: 'hackathon-2026',
        title: 'Inter-University Hackathon',
        dateTime: '2026-07-02T12:00',
        venue: 'Lab 3',
    },
    {
        id: 'alumni-night',
        title: 'Alumni Networking Night',
        dateTime: '2026-08-19T18:00',
        venue: 'Auditorium Center',
    },
    {
        id: 'art-exhibition',
        title: 'Matriculation Art Exhibition',
        dateTime: '2026-09-05T10:30',
        venue: 'Conference Room B',
    },
];

let activeEventId = null;

function openModal() {
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
    }
}

function compareEventTimes(firstEvent, secondEvent) {
    return new Date(firstEvent.dateTime) - new Date(secondEvent.dateTime);
}

function getEvents() {
    const savedEvents = localStorage.getItem(eventStorageKey);

    if (!savedEvents) {
        return defaultEvents.slice();
    }

    try {
        const parsedEvents = JSON.parse(savedEvents);

        if (Array.isArray(parsedEvents)) {
            return parsedEvents;
        }
    } catch (error) {
        return defaultEvents.slice();
    }

    return defaultEvents.slice();
}

function saveEvents(events) {
    localStorage.setItem(eventStorageKey, JSON.stringify(events));
}

function getSortedEvents() {
    const events = getEvents().slice();
    events.sort(compareEventTimes);
    return events;
}

function formatEventTime(value) {
    if (!value) {
        return '';
    }

    const dateTime = new Date(value);

    if (Number.isNaN(dateTime.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(dateTime);
}

function renderEventCard(event, showEditButton) {
    let html = '<div class="event-card" data-event-id="' + event.id + '">';
    html += '<h3>' + event.title + '</h3>';
    html += '<div class="event-meta">';
    html += '<span>📅 ' + formatEventTime(event.dateTime) + '</span>';
    html += '<span>📍 ' + event.venue + '</span>';
    html += '</div>';

    if (showEditButton) {
        html += '<button type="button" class="btn-primary small-btn editEventBtn">Edit Details</button>';
    }

    html += '</div>';
    return html;
}

function renderDashboardEvents() {
    if (!dashboardGrid || !openBtn) {
        return;
    }

    const dashboardEvents = getSortedEvents().slice(0, 4);
    let html = '';

    for (let index = 0; index < dashboardEvents.length; index += 1) {
        html += renderEventCard(dashboardEvents[index], false);
    }

    dashboardGrid.innerHTML = html;
}

function renderManageEvents() {
    if (!dashboardGrid || !editEventForm) {
        return;
    }

    const events = getSortedEvents();
    let html = '';

    for (let index = 0; index < events.length; index += 1) {
        html += renderEventCard(events[index], true);
    }

    dashboardGrid.innerHTML = html;
}

function renderScheduleEvents() {
    if (!scheduleList) {
        return;
    }

    const events = getSortedEvents();
    let html = '';

    for (let index = 0; index < events.length; index += 1) {
        html += '<p class="schedule-item">';
        html += '<strong>' + formatEventTime(events[index].dateTime) + ':</strong> ';
        html += events[index].title + ' (' + events[index].venue + ')';
        html += '</p>';
    }

    scheduleList.innerHTML = html;
}

function openEditEvent(eventId) {
    const events = getEvents();
    let eventData = null;

    for (let index = 0; index < events.length; index += 1) {
        if (events[index].id === eventId) {
            eventData = events[index];
            break;
        }
    }

    if (!eventData) {
        return;
    }

    activeEventId = eventId;

    if (eventNameInput) {
        eventNameInput.value = eventData.title;
    }

    if (eventTimeInput) {
        eventTimeInput.value = eventData.dateTime;
    }

    if (modal) {
        modal.classList.add('active');
    }
}

function getClosestEventButton(element) {
    let currentElement = element;

    while (currentElement) {
        if (currentElement.classList && currentElement.classList.contains('editEventBtn')) {
            return currentElement;
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}

function getClosestEventCard(element) {
    let currentElement = element;

    while (currentElement) {
        if (currentElement.classList && currentElement.classList.contains('event-card')) {
            return currentElement;
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}

function handleDocumentClick(event) {
    const editButton = getClosestEventButton(event.target);

    if (!editButton) {
        return;
    }

    const eventCard = getClosestEventCard(editButton);

    if (!eventCard) {
        return;
    }

    openEditEvent(eventCard.dataset.eventId || '');
}

document.addEventListener('click', handleDocumentClick);

renderDashboardEvents();
renderManageEvents();
renderScheduleEvents();

function handleOpenButtonClick() {
    openModal();
}

function handleCloseButtonClick() {
    closeModal();
}

function handleWindowClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

function handleMenuButtonClick() {
    sideBar.classList.toggle('active');
}

function handleBookingFormSubmit(event) {
    event.preventDefault();

    const eventTitle = document.getElementById('eventTitle');
    const eventDate = document.getElementById('eventDate');
    const venue = document.getElementById('venue');

    if (!eventTitle || !eventDate || !venue) {
        return;
    }

    const title = eventTitle.value.trim();
    const dateTime = eventDate.value;
    const venueName = venue.value;

    if (!title || !dateTime) {
        return;
    }

    const events = getEvents();

    events.push({
        id: String(Date.now()),
        title: title,
        dateTime: dateTime,
        venue: venueName,
    });

    saveEvents(events);

    renderDashboardEvents();
    renderManageEvents();
    renderScheduleEvents();

    alert('Form submitted successfully!');
    closeModal();
    form.reset();
}

function handleEditEventFormSubmit(event) {
    event.preventDefault();

    if (activeEventId && eventNameInput && eventTimeInput) {
        const eventName = eventNameInput.value.trim();
        const eventTime = eventTimeInput.value;

        const events = getEvents();
        const updatedEvents = [];

        for (let index = 0; index < events.length; index += 1) {
            if (events[index].id === activeEventId) {
                updatedEvents.push({
                    id: events[index].id,
                    title: eventName,
                    dateTime: eventTime,
                    venue: events[index].venue,
                });
            } else {
                updatedEvents.push(events[index]);
            }
        }

        saveEvents(updatedEvents);
        renderDashboardEvents();
        renderManageEvents();
        renderScheduleEvents();
    }

    closeModal();
    editEventForm.reset();
    activeEventId = null;
}

function handleEditEventButtonClick(event) {
    const editButton = getClosestEventButton(event.target);

    if (!editButton) {
        return;
    }

    const eventCard = getClosestEventCard(editButton);

    if (!eventCard) {
        return;
    }

    openEditEvent(eventCard.dataset.eventId || '');
}

if (openBtn) {
    openBtn.addEventListener('click', handleOpenButtonClick);
}

if (closeBtn) {
    closeBtn.addEventListener('click', handleCloseButtonClick);
}

if (modal) {
    window.addEventListener('click', handleWindowClick);
}

if (menuBtn && sideBar) {
    menuBtn.addEventListener('click', handleMenuButtonClick);
}

if (form) {
    form.addEventListener('submit', handleBookingFormSubmit);
}

if (editEventForm) {
    editEventForm.addEventListener('submit', handleEditEventFormSubmit);
}

document.addEventListener('click', handleEditEventButtonClick);