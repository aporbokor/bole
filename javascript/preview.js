const preview_window = document.querySelector('.toc-preview');
const toc = document.querySelector('#toc');
const toc_links = toc.querySelectorAll('a');
const start_tab_index = 3;

let curr_img;

const starter_text = document.createElement('p');
starter_text.innerText = 'Hover over table of content link to show preview';
preview_window.appendChild(starter_text);

const no_preview = document.createElement('p');
no_preview.innerText = 'No preview available'


function hide_preview() {
    preview_window.removeChild(curr_img);
}

function show_preview() {
    preview_window.appendChild(curr_img);
    make_viewables(curr_img);
}


function get_preview_img(a) {
    const id = a.href.split('#');
    const tabIndex = a.tabIndex;

    if (id.length == 1) {
        return no_preview;
    }

    const section = document.querySelector('#' + id[id.length - 1]);

    const content = section.querySelector('.section-starter-content').cloneNode(true);

    if (content == null) {
        const returned = document.createElement('p');
        returned.innerText = 'No preview content available.'
        return returned;
    }

    for (const link of content.querySelectorAll('a[href]')) {
        link.tabIndex = tabIndex;
    }

    return content.cloneNode(true);
}

curr_img = document.createElement('p');
curr_img.textContent = 'Nothing is selected yet.'
show_preview();

for (let i = 0; i < toc_links.length; i++) {

    const a = toc_links[i];
    a.tabIndex = start_tab_index + i;

    const func = () => {
        hide_preview();
        curr_img = get_preview_img(a);
        show_preview();
    }

    a.addEventListener('focusin', func);
    a.addEventListener('mouseenter', func);
}