const TOGGLE_BUTTON = document.getElementById('toggle-button');
TOGGLE_BUTTON.addEventListener('click', function (){
    const EMAIL_CONTACT = document.getElementById('contact-email')

    if (EMAIL_CONTACT.style.display === 'none' ||
        EMAIL_CONTACT.style.display == '') {
            EMAIL_CONTACT.style.display = 'block';
            TOGGLE_BUTTON.textContent = 'Hide';
        }
    else {
            EMAIL_CONTACT.style.display = 'none';
            TOGGLE_BUTTON.textContent = 'Contact with me';
        }
});
console.log("7777777 over")