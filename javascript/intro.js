const intro = document.querySelector('#intro');


function animate_in() {
    intro.classList.add('intro-animate-in');
}

intro.classList.remove('intro-animate-in');

setTimeout(animate_in, 0);