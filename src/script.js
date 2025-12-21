const { Router, html, AnimUtils, BottomSheet, utils, Toast, ShakeIt } = HMI_UI;
const { afterPageLoad } = utils();

const r = new Router("#app", {
  useGesture: false,
  enablePreload: false,
  onSecondDataRouteClick: () => {},
});

let sheet = null;
let currentImg = "";

r.add("home", HomePage, { cache: false })
  .add("palettes", PalettesPage, { cache: false })
  .add("favorites", FavoritesPage, { cache: false })
  .add("feedback", FeedbackPage, { cache: false })
  .add("about", AboutPage, { cache: false })
  .add("single-palette", SinglePalettePage, { cache: false })
  .setOrdered(["home", "palettes", "favorites"])
  .start("home");

r.addHook("beforeRender", ({ routeName, params }) => {
  const Navbar = document.querySelector("nav");

  if (
    routeName === "single-palette" ||
    routeName === "about" ||
    routeName === "feedback"
  ) {
    AnimUtils.zoomOut(Navbar, {
      duration: 80,
      keepState: true,
    }).then(() => {
      Navbar.style.display = "none";
    });
  } else {
    AnimUtils.clearAnimations(Navbar);
    Navbar.style.display = "";
    AnimUtils.zoomIn(Navbar, {
      duration: 120,
      delay: 80,
      keepState: true,
    });
  }
});

window.vibrateInRipple = true;
