const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const menuBtn = document.getElementById('menuToggle');
const sideBar = document.getElementById('sidebar');
const form = document.getElementById('bookingForm');

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