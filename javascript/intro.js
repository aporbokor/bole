const intro = document.querySelector('#intro');
intro.classList.remove('intro-animate-in');


function animate_in() {
    intro.classList.add('intro-animate-in');
}


window.onload = () => {
    intro.classList.remove('intro-animate-in');
    setTimeout(animate_in, 0);
}