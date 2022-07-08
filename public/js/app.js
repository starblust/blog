
function markActiveMenuItem(page) {
    document.querySelector(`#top-nav a[data-item-page="${page}"]`).parentElement.classList.add('active');
}

markActiveMenuItem(document.querySelector('#body-box').getAttribute('data-page'));