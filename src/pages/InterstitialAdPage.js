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
      <div class="mt-24 flex flex-col items-center justify-center px-4">
        <h1 class="text-2xl font-bold mb-4 text-center">Interstitial Ad</h1>
        <p class="text-center mb-6">
          This is a placeholder for an interstitial advertisement. In a real
          application, this space would be used to display ads between content
          pages.
        </p>
        <div
          class="w-full max-w-md h-64 bg-gray-300 border border-gray-400 rounded-lg flex items-center justify-center"
        >
          <span class="text-gray-600">Ad Content Here</span>
        </div>
      </div>
    </section>
  `;

  afterPageLoad(() => {
    const { prevRouteName } = params;
    const closeBtn = el.querySelector("#closeBtn");

    // --- DISABLE navigation ---
    const disableNavigation = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
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
  });

  return Content;
};
