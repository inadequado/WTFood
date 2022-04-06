// CSS
import "bootstrap";
import "./styles/index.scss";

// HTML
import homeHTML from "./pages/home.html";
import communityHTML from "./pages/community.html";
import loginHTML from "./pages/login.html";
import recipesHTML from "./pages/recipes.html";
import profileHTML from "./pages/profile.html";
import oneRecipeHTML from "./pages/oneRecipe.html";
import userRecipeHTML from "./pages/userRecipe.html";

// JS
import Swal from "sweetalert2";
import script from "./route/script.js";
import { auth, onAuthStateChanged } from "./firebase.js";

// import login from "./js/login.js";
// let initLogin = await import(`../js/login.js`); // lazily loading the js files
// initLogin.default();

// Images
import imgLogo from "./images/logo.png";
import imgFavicon48 from "./images/icon-48x48.png";
import imgFavicon57 from "./images/icon-57x57.png";
import imgFavicon72 from "./images/icon-72x72.png";
import imgFavicon96 from "./images/icon-96x96.png";
import imgFavicon114 from "./images/icon-114x114.png";
import imgFavicon144 from "./images/icon-144x144.png";
import imgFavicon152 from "./images/icon-152x152.png";
import imgFavicon192 from "./images/icon-192x192.png";
import imgFavicon256 from "./images/icon-256x256.png";
import imgFavicon384 from "./images/icon-384x384.png";
import imgFavicon512 from "./images/icon-512x512.png";
import imgFavicon16 from "./images/favicon-16x16.png";
import imgFavicon32 from "./images/favicon-32x32.png";

import imgLogoWhite from "./images/logo_white.svg";
// import donuts from "./images/placeholder-donuts.png";

// PWA
import manifest from "./app.webmanifest";
import sw from "./sw.js";
import firebase from "./firebase.js";

//Hamburguer menu
const mainNav = document.getElementById("mainNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".nav__link");
const body = document.body;

const showMenu = () => {
  navToggle.setAttribute("aria-expanded", true);
  mainNav.setAttribute("data-visible", true);
  mainNav.setAttribute("aria-hidden", false);
  body.classList.add("black-overlay");
};

const hideMenu = () => {
  navToggle.setAttribute("aria-expanded", false);
  mainNav.setAttribute("data-visible", false);
  mainNav.setAttribute("aria-hidden", true);

  body.classList.remove("black-overlay");
};

navToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  console.log(JSON.parse(navToggle.getAttribute("aria-expanded")));
  JSON.parse(navToggle.getAttribute("aria-expanded")) ? hideMenu() : showMenu();
});

const handleMenuClosure = (event) => !mainNav.contains(event.target) && hideMenu();

window.addEventListener("click", handleMenuClosure);
window.addEventListener("focusin", handleMenuClosure);

// on clicking the link
navLinks.forEach((navLink) => {
  if (navLink.id !== "login-nav") {
    navLink.addEventListener("click", (e) => {
      // console.log("works");
      const body = document.body;
      body.classList.toggle("black-overlay");
      mainNav.setAttribute("data-visible", false);
      navToggle.setAttribute("aria-expanded", false);

      // location.assign(location.pathname)
      // hash from <a> tag
      const hash = navLink.textContent.toLowerCase();
      // console.log(hash);

      // Clear search query
      e.preventDefault();
      window.location.hash = hash;

      if (window.location.search) {
        window.location.search = "";
      }
      // window.location.search = "";
      // location.href = `#${hash}`;
      // console.log(`${window.location.origin}${hash}`)
    });
  }
});

const loginNav = document.querySelector(".login__item");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // alert('SIGNED in')
    const cardImage = document.createElement("img");
    cardImage.classList.add("login-avatar");
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("header__avatar-container");
    cardImage.src = `${
      user.photoURL
        ? user.photoURL
        : "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
    }`;
    loginNav.innerHTML = "";
    avatarDiv.appendChild(cardImage);
    loginNav.appendChild(avatarDiv);
    // loginNav.removeAttribute("data-bs-toggle");
    // loginNav.removeAttribute("data-bs-target");
    // loginNav.setAttribute("href", "#profile");
    // loginNav.innerHTML = "YOU ARE SIGNED IN";

    // const uid = user.uid;
    // ...
  } else {
    loginNav.innerHTML = `
      <a id="login-nav" data-bs-toggle="modal" data-bs-target="#exampleModal" class="nav__link">
        login
      </a>
    `;
    // loginNav.setAttribute("data-bs-toggle", "modal");
    // loginNav.setAttribute("data-bs-target", "#exampleModal");
    // loginNav.removeAttribute("href");
    // if (window.location.hash == "profile") {
    //   alert("user is NOT signed in");
    //   window.location.href = "#home";
    // }
  }
});

function transformBtnNavLink(btn) {
  const btnActive = document.querySelector(".nav-active");
  if (btnActive) {
    btnActive.classList.remove("nav-active");
  }

  btn.classList.add("nav-active");
}

function closeOneModal(modalId) {
  // get modal
  const modal = document.getElementById(modalId);
  // change state like in hidden modal
  modal.classList.remove("show");
  document.querySelector("body").classList.remove("modal-open");
  setTimeout(ariahidden, 300);
  function ariahidden() {
    console.log("here");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelector("body").removeAttribute("style");

  modal.removeAttribute("aria-modal");

  modal.setAttribute("style", "display: none");

  // get modal backdrop
  const modalBackdrops = document.getElementsByClassName("modal-backdrop");

  // remove opened modal backdrop
  document.body.removeChild(modalBackdrops[0]);
}
const constructionPage = document.querySelectorAll('.construction');

constructionPage.forEach((click) => {
    click.addEventListener('click', () => {
        Swal.fire({
            title: "Warning",
            text: "Please sing in to use your profile!",
            icon: "warning",
            confirmButtonColor: "#fd8722",
            iconColor: "#ffbc3a",
            color: "#28231e",
            showDenyButton: true,
            denyButtonText: `Go to Homepage`,
            denyButtonColor: "#ffbc3a",
            customClass: {
                htmlContainer: "toast-body",
            },
        }).then((result) => {
            // const modalSign = document.getElementById('exampleModal');
            if (result.isDenied) {
                location.hash = "profile";
            }
            window.location.href = "#home";
        });
    });
});