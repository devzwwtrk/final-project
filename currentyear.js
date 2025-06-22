window.addEventListener('DOMContentLoaded', ()=>{
    const year = document.getElementById('current-year');
    year.textContent = new Date().getFullYear();
});