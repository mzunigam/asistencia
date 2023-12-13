function requireAuth() {
    const access = sessionStorage.getItem('userFullName') === null;
    if (access) {
        /*window.location.href = 'index.html';*/
    }
}

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
});