const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const menuBtn = document.getElementById('menuToggle');
const sideBar = document.getElementById('sidebar');
const form = document.getElementById('bookingForm');
const editEventForm = document.getElementById('editEventForm');
const editEventBtn = document.getElementById('editEventBtn');

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

if (editEventBtn) {
        editEventBtn.addEventListener('click', function () {
            if (modal) {
                modal.classList.add('active');
            }
        });
    }


if (openBtn) {
    openBtn.addEventListener('click', openModal);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

if (modal) {
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
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

if (editEventForm) {
    editEventForm.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Event details updated successfully!');
        closeModal();
        editEventForm.reset();
    });
}