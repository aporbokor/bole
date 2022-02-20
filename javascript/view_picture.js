const body = document.body;
const pictures = document.querySelectorAll('.viewable_picture');
let holder = document.createElement('div');
holder.classList.remove('pic_holder');
holder.classList.add('hidden')

body.appendChild(holder);

function show_picture(p) {

    const pic = p.cloneNode();
    let clicked_inside = false;

    holder.appendChild(pic);
    holder.classList.add('pic_holder');
    holder.classList.remove('hidden')

    pic.addEventListener('click', () => { clicked_inside = true });
    holder.addEventListener('click', () => {

        if (clicked_inside == true) {
            clicked_inside = false;
            return
        }

        holder.removeChild(pic);
        holder.classList.add('hidden')
        holder.classList.remove('pic_holder');
    })
}

for (const p of pictures) {
    p.addEventListener('click', () => { show_picture(p) });
}