const InterstitialAdPage = (params, el) => {
  const Content = html`
    <section class="relative">
      <div
        class="absolute top-5 right-5 bg-[#232323] text-white rounded font-medium shadow-md transition-all hover:bg-gray-700"
      >
        <button
          id="closeBtn"
          style="display:none;"
          class="ripple-container px-4 py-2"
        >
          Close
        </button>
      </div>
      <div class="mt-32 flex flex-col items-center justify-center px-4">
        <h1 class="text-2xl font-bold mb-4 text-center">Sponsored</h1>

        <div
          id="adBox"
          class="ripple-container no-shake w-full max-w-md bg-[#1f1f1f] border border-[#2a2a2a] rounded-3xl flex flex-col items-center justify-center text-center p-6 shadow-lg cursor-pointer"
        >
          <p class="text-gray-400">Loading ad…</p>
        </div>
      </div>
    </section>
  `;

  const fetchRandomAd = async (url = "/ads.json") => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!Array.isArray(data.ads) || !data.ads.length) return null;

      const index = Math.floor(Math.random() * data.ads.length);
      return data.ads[index];
    } catch (e) {
      console.warn("Ad fetch failed", e);
      return null;
    }
  };

  afterPageLoad(async () => {
    const { prevRouteName } = params;
    const closeBtn = el.querySelector("#closeBtn");
    const adBox = el.querySelector("#adBox");

    // --- DISABLE navigation ---
    const disableNavigation = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // --- Fetch & render ad ---
    let ad = await fetchRandomAd(ADS_DATA_URL);
    // ad = "";
    if (ad) {
      window.addEventListener("popstate", disableNavigation, true);
      // Countdown logic
      let countdown = 5; // seconds
      closeBtn.textContent = `Close in ${countdown}s`;
      closeBtn.style.display = "block";
      AnimUtils.zoomIn(closeBtn, { keepState: true });

      const interval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
          closeBtn.textContent = `Close in ${countdown}s`;
        } else {
          clearInterval(interval);
          closeBtn.textContent = "Close";
          // Enable navigation when clicked
          window.removeEventListener("popstate", disableNavigation, true);
          closeBtn.addEventListener("click", () => {
            localStorage.setItem("navigationTime", 0);
            navigationTime = 0;
            r.navigateTo(prevRouteName || "home");
          });
        }
      }, 1000);

      adBox.innerHTML = html`
        <img
          src="${ad.imageUrl}"
          alt="${ad.title}"
          onerror="this.style.display='none';"
          class="size-48 mb-4 rounded-3xl object-cover shadow-md"
        />
        <h2 class="text-xl font-semibold mb-2">${ad.title}</h2>
        <p class="text-gray-400 mb-4">${ad.description}</p>
        <span class="text-blue-500 font-medium underline">Learn More</span>
      `;

      adBox.onclick = () => {
        localStorage.setItem("navigationTime", 0);
        navigationTime = 0;
        r.navigateTo(prevRouteName || "home");
        setTimeout(() => {
          window.open(ad.href, "_blank", "noopener");
        }, 500);
      };
    } else {
      window.removeEventListener("popstate", disableNavigation, true);
      localStorage.setItem("navigationTime", 0);
      navigationTime = 0;
      setTimeout(() => {
        r.navigateTo(prevRouteName || "home");
      }, 500);
    }
  });

  return Content;
};
