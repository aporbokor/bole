const back_to_top = document.querySelector(".back-to-top");
const body = document.body;

window.onscroll = () => {
  if (body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    back_to_top.classList.add("active-back-to-top");
    return;
  }
  back_to_top.classList.remove("active-back-to-top");
};
