const preview_window = document.querySelector('.toc-preview');
const toc = document.querySelector('#toc');
const toc_links = toc.querySelectorAll('a');

let curr_img;

const starter_text = document.createElement('p');
starter_text.innerText = 'Hover over table of content link to show preview';
preview_window.appendChild(starter_text);


function hide_preview() {
    preview_window.removeChild(curr_img);
}

function show_preview() {
    preview_window.appendChild(curr_img);
}


function get_preview_img(a) {
    const id = a.href.split('#');
    console.log(id)

    const section = document.querySelector('#' + id[id.length - 1]);

    const content = section.querySelector('.section-starter-content');

    if (content == null) {
        const returned = document.createElement('p');
        returned.innerText = 'No preview content available.'
        return returned;
    }

    return content.cloneNode(true);
}

curr_img = document.createElement('p');
curr_img.textContent = 'Nothing is selected yet.'
show_preview();

console.log(toc_links);

for (const a of toc_links) {
    const func = () => {
        hide_preview();
        curr_img = get_preview_img(a);
        show_preview();
    }

    a.addEventListener('focusin', func);
    a.addEventListener('mouseenter', func);
}