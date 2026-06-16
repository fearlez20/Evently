const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const menuBtn = document.getElementById('menuToggle');
const sideBar = document.getElementById('sidebar');
const form = document.getElementById('bookingForm');

function openModal() {
const bookingForm = document.getElementById('bookingForm');
const editEventForm = document.getElementById('editEventForm');
const eventTitleInput = document.getElementById('eventTitle');
const eventDateInput = document.getElementById('eventDate');
const venueSelect = document.getElementById('venue');
const eventNameInput = document.getElementById('eventName');
const eventTimeInput = document.getElementById('eventTime');
const eventVenueInput = document.getElementById('eventVenue');
const deleteEventBtn = document.getElementById('deleteEventBtn');
const dashboardGrid = document.querySelector('.dashboard-grid');
const scheduleBody = document.querySelector('.schedule-body');

const eventStorageKey = 'eventlyEvents';
let activeEventId = '';

function getEvents() {
    try {
        const savedEvents = localStorage.getItem(eventStorageKey);
        return savedEvents ? JSON.parse(savedEvents) : [];
    } catch {
        return [];
    }
}

function saveEvents(events) {
    localStorage.setItem(eventStorageKey, JSON.stringify(events));
}

function sortedEvents() {
    return getEvents().slice().sort(function (first, second) {
        return new Date(first.dateTime) - new Date(second.dateTime);
    });
}

function formatEventTime(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

function showModal() {
    if (modal) {
        modal.classList.add('active');
    }
}

<<<<<<< HEAD
function closeModal() {
=======
function hideModal() {
>>>>>>> e467c88838e3a08aba3e0c18ba557c997d6bfb11
    if (modal) {
        modal.classList.remove('active');
    }
}

if (openBtn) {
    openBtn.addEventListener('click', openModal);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
function renderCards(events, showEditButton) {
    return events.map(function (event) {
        return '<div class="event-card" data-event-id="' + event.id + '">' +
            '<h3>' + event.title + '</h3>' +
            '<div class="event-meta">' +
            '<span>📅 ' + formatEventTime(event.dateTime) + '</span>' +
            '<span>📍 ' + event.venue + '</span>' +
            '</div>' +
            (showEditButton ? '<button type="button" class="btn-primary small-btn editEventBtn">Edit Details</button>' : '') +
            '</div>';
    }).join('');
}

function renderPage() {
    const events = sortedEvents();

    if (scheduleBody) {
        scheduleBody.innerHTML = events.map(function (event) {
            return '<div class="schedule-row">' +
                '<span class="schedule-cell">' + event.title + '</span>' +
                '<span class="schedule-cell">' + event.venue + '</span>' +
                '<span class="schedule-cell">' + formatEventTime(event.dateTime) + '</span>' +
                '</div>';
        }).join('');
        return;
    }

    if (!dashboardGrid) {
        return;
    }

    if (editEventForm) {
        dashboardGrid.innerHTML = renderCards(events, true);
        return;
    }

    if (openBtn) {
        dashboardGrid.innerHTML = renderCards(events.slice(0, 4), false);
    }
}

function findEventById(eventId) {
    return getEvents().find(function (event) {
        return event.id === eventId;
    });
}

function openEditEvent(eventId) {
    const eventData = findEventById(eventId);

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

    if (eventVenueInput) {
        eventVenueInput.value = eventData.venue;
    }

    showModal();
}

function updateActiveEvent(removeEvent) {
    const events = getEvents();

    if (removeEvent) {
        saveEvents(events.filter(function (event) {
            return event.id !== activeEventId;
        }));
    } else {
        saveEvents(events.map(function (event) {
            if (event.id !== activeEventId) {
                return event;
            }

            return {
                id: event.id,
                title: eventNameInput.value.trim(),
                dateTime: eventTimeInput.value,
                venue: eventVenueInput.value.trim(),
            };
        }));
    }

    renderPage();
    hideModal();

    if (editEventForm) {
        editEventForm.reset();
    }

    activeEventId = '';
}

if (openBtn) {
    openBtn.addEventListener('click', showModal);
}

if (closeBtn) {
    closeBtn.addEventListener('click', hideModal);
}

if (modal) {
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
            hideModal();
        }
    });
}

if (menuBtn && sideBar) {
    menuBtn.addEventListener('click', function () {
        sideBar.classList.toggle('active');
    });
}

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Form submitted successfully!');
        closeModal();
        form.reset();
    });
}
if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = eventTitleInput.value.trim();
        const dateTime = eventDateInput.value;
        const venue = venueSelect.value;

        if (!title || !dateTime) {
            return;
        }

        const events = getEvents();

        events.push({
            id: String(Date.now()),
            title: title,
            dateTime: dateTime,
            venue: venue,
        });

        saveEvents(events);
        renderPage();
        hideModal();
        bookingForm.reset();
    });
}

if (editEventForm) {
    editEventForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (activeEventId) {
            updateActiveEvent(false);
        }
    });
}

if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', function () {
        if (activeEventId) {
            updateActiveEvent(true);
        }
    });
}

document.addEventListener('click', function (event) {
    const editButton = event.target.closest('.editEventBtn');

    if (!editButton) {
        return;
    }

    const eventCard = editButton.closest('.event-card');

    if (eventCard) {
        openEditEvent(eventCard.dataset.eventId || '');
    }
});

renderPage();
