function myFunction() {
  var element = document.getElementsByClassName("hamburger")[0];
  element.classList.toggle("is-active");
  document.getElementsByClassName("navigation")[0].classList.toggle("navigation--show");
  document.getElementsByClassName("primary-nav")[0].classList.toggle("primary-nav--show");

  document.getElementsByClassName("main-content")[0].classList.toggle("hide");
}
