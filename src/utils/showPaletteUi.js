const showPalette = (paletteData, container) => {
  if (!paletteData?.palette?.length) {
    container.innerHTML =
      '<p class="text-gray-500 text-lg text-center mt-4">No colors detected.</p>';
    return;
  }

  const { palette, palette_image_url, schemes, exports } = paletteData;

  // --- Click handler for copying colors & exports ---
  container.onclick = (e) => {
    const colorBtn = e.target.closest("[data-color]");
    const exportBtn = e.target.closest("[data-export]");

    if (colorBtn) {
      const color = colorBtn.dataset.color;
      const textColor = "white";

      if (window.Android) {
        Android.copyToClipboard(color);
        ShakeIt();
      } else {
        navigator.clipboard.writeText(color);
        Toast.show(
          `Copied <span style="background:${color}; color:${textColor}">${color}</span> to clipboard`
        );
      }
    } else if (exportBtn) {
      const type = exportBtn.dataset.export;
      const map = {
        json: exports.json,
        css: exports.css,
        tailwind: exports.tailwind,
        svg: exports.svg,
      };
      Android.copyToClipboard(map[type]);
    }
  };

  // --- Render single color card ---
  const paletteCards = palette.map(ColorCard).join("");

  // --- Suggested schemes UI ---
  const schemesHTML = schemes
    ? Object.entries(schemes)
        .map(
          ([mode, s]) => html`
            <div class="my-3">
              <div class="flex items-center gap-3 mb-3">
                <hr class="border-gray-700 w-full" />
                <h4
                  class="text-gray-400 text-center text-nowrap capitalize text-base font-semibold"
                >
                  ${mode}
                </h4>
                <hr class="border-gray-700 w-full" />
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                ${s.colors.map(ColorCard).join("")}
              </div>
              <div>
                <img
                  onerror="this.style.display='none'"
                  src="${s.image.named}"
                  alt="${mode} scheme"
                  class="my-3 rounded-3xl shadow-md w-full object-cover"
                />
              </div>
            </div>
          `
        )
        .join("")
    : "";

  // --- Build markup ---
  const paletteHTML = html`
    <div class="animate-fadeIn space-y-5">
      <!-- Preview Image -->
      <div
        class="relative mx-auto w-full max-w-sm rounded-2xl overflow-hidden border border-[#1e1e1e] shadow-lg"
      >
        <img
          src="${palette_image_url}"
          alt="Extracted palette preview"
          class="w-full h-auto object-cover"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
        ></div>
      </div>

      <!-- Palette Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        ${paletteCards}
      </div>

      <!-- Exports -->
      <br />
      <h1 class="text-gray-100 text-xl font-semibold">Export Palette</h1>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <button
          data-export="json"
          class="btn bg-[#1e1e1e] ripple-container px-6 py-3 rounded-full shadow font-medium"
        >
          JSON
        </button>
        <button
          data-export="css"
          class="btn bg-[#1e1e1e] ripple-container px-6 py-3 rounded-full shadow font-medium"
        >
          CSS Vars
        </button>
        <button
          data-export="tailwind"
          class="btn bg-[#1e1e1e] ripple-container px-6 py-3 rounded-full shadow font-medium"
        >
          Tailwind
        </button>
        <button
          data-export="svg"
          class="btn bg-[#1e1e1e] ripple-container px-6 py-3 rounded-full shadow font-medium"
        >
          SVG
        </button>
      </div>

      <!-- Suggested Schemes -->
      <br />
      <div class="mb-4">
        <h3 class="text-gray-100 text-xl font-semibold mb-3">
          Suggested Schemes
        </h3>
        ${schemesHTML}
      </div>
    </div>
  `;

  container.innerHTML = paletteHTML;
  const colorSchemas = container.querySelectorAll(".colorSchema");
  colorSchemas.forEach((schema) => {
    schema.onclick = () => {
      const color = schema.style.backgroundColor;
      Android.copyToClipboard(color);
    };
  });
};
