/* This app is built for android devices only using CoreX engine v2.3.8 */

const { Router, html, AnimUtils, BottomSheet, utils, Toast, ShakeIt } = HMI_UI;
const { afterPageLoad } = utils();

const r = new Router("#app", {
  useGesture: false,
  enablePreload: false,
  onSecondDataRouteClick: () => {},
});

let sheet = null;
let currentImg = "";
let navigationTime = parseInt(localStorage.getItem("navigationTime")) || 0;

r.add("home", HomePage, { cache: false })
  .add("palettes", PalettesPage, { cache: false })
  .add("favorites", FavoritesPage, { cache: false })
  .add("feedback", FeedbackPage, { cache: false })
  .add("about", AboutPage, { cache: false })
  .add("fullPageAd", InterstitialAdPage, { cache: false })
  .add("single-palette", SinglePalettePage, { cache: false })
  .setOrdered(["home", "palettes", "favorites"])
  .start("home")
  .then(() => {
    const connectionBanner = document.getElementById("cnBanner");
    const scanUploadBtn = document.getElementById("scanUploadBtn");

    // Function to update banner visibility
    const updateConnectionStatus = () => {
      if (navigator.onLine) {
        AnimUtils.zoomOut(connectionBanner).then(() => {
          connectionBanner.style.display = "none";
        });
        if (scanUploadBtn) scanUploadBtn.disabled = false;
      } else {
        connectionBanner.style.display = "block";
        AnimUtils.zoomIn(connectionBanner, { keepState: true });
        if (scanUploadBtn) scanUploadBtn.disabled = true;
      }
    };

    // Initial check
    updateConnectionStatus();

    // Listen for connection changes
    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    // Optional: periodic check in case events are missed
    setInterval(updateConnectionStatus, 5000); // every 5 seconds
  });

r.addHook("beforeRender", ({ routeName, params }) => {
  const Navbar = document.querySelector("nav");

  if (
    routeName === "single-palette" ||
    routeName === "settings" ||
    routeName === "about" ||
    routeName === "fullPageAd" ||
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

r.addHook("afterNavigate", ({ routeName, params, el }) => {
  if (isNaN(navigationTime)) navigationTime = 0;
  if (navigationTime > 15 && routeName !== "fullPageAd") {
    setTimeout(() => {
      r.navigateTo("fullPageAd", { params: { prevRouteName: routeName } });
    }, 250);
    return;
  }

  navigationTime += 1;
  localStorage.setItem("navigationTime", navigationTime);
});

window.vibrateInRipple = true;
