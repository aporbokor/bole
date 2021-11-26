const pictures = document.getElementsByClassName('viewable_picture');
let picture_holder;

function display_picture(){
  console.log("ran")
  const displayed_img = document.createElement('img');
  displayed_img.src = this.src;

  const pic_holder = document.createElement('div');

  pic_holder.setAttribute("class","pic_holder");
  pic_holder.appendChild(displayed_img);
  document.body.appendChild(pic_holder);

  displayed_img.addEventListener("click", function(){
    this.setAttribute("data-clicked","true");
  })

  pic_holder.addEventListener('click', function(){
    if (displayed_img.getAttribute("data-clicked") === "true") {
      displayed_img.setAttribute("data-clicked", "false");
      return;
    }
    this.remove();
  });
}

for (let i = 0; i < pictures.length; i++) {
  pictures[i].addEventListener('click', display_picture);
}
