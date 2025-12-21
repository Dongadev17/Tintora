const showPalette = (paletteData, container) => {
  if (!paletteData?.palette?.length) {
    container.innerHTML =
      '<p class="text-gray-500 text-lg text-center mt-4">No colors detected.</p>';
    return;
  }

  const { palette, palette_image_url } = paletteData;

  const colorCard = (c, textColor, percentage, rgbText) => html`
    <div
      class="ripple-container no-shake rounded-2xl border border-[#1e1e1e] shadow-lg"
      style="background:${c.color}; color:${textColor}"
      title="${c.color}"
    >
      <div
        class="p-2 flex flex-col items-center justify-between h-full rounded-2xl bg-black/10 backdrop-blur-[1px]"
      >
        <span class="text-base font-semibold drop-shadow-sm"> ${c.color} </span>
        <span class="text-sm opacity-65 font-medium drop-shadow-sm">
          ${percentage}
        </span>
        <span class="text-xs opacity-50 font-mono mt-1"> ${rgbText} </span>
      </div>
    </div>
  `;

  const paletteCard = palette
    .map((c) => {
      const textColor = getContrastColor(c.color);
      const rgbText = c.rgb?.length ? `rgb(${c.rgb.join(", ")})` : "Unknown";
      const percentage = c.percentage
        ? `${(c.percentage * 100).toFixed(1)}%`
        : "";

      container.addEventListener("click", (e) => {
        const target = e.target.closest("[title]");
        if (target && target.title === c.color) {
          if (window.Android) {
            Android.copyToClipboard(c.color);
            ShakeIt();
          } else {
            navigator.clipboard.writeText(c.color);
            Toast.show(
              `Copied <span style="background:${c.color}; color:${textColor}">${c.color}</span> to clipboard`
            );
          }
        }
      });

      return colorCard(c, textColor, percentage, rgbText);
    })
    .join("");
  // Build markup efficiently (single DOM write)
  const paletteHTML = html`
    <div class="animate-fadeIn">
      <h2 class="text-xl text-white font-semibold mb-4 text-center">
        Extracted Palette
      </h2>

      <!-- Preview Image -->
      <div
        class="relative mx-auto w-full max-w-sm mb-4 rounded-2xl overflow-hidden border border-[#1e1e1e] shadow-lg"
      >
        <img
          src="${palette_image_url}"
          alt="Extracted palette preview"
          class="w-full h-auto object-cover transition-transform duration-300"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
        ></div>
      </div>

      <!-- Palette Colors Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-4">
        ${paletteCard}
      </div>
    </div>
  `;

  // One-time DOM update (avoids reflows)
  container.innerHTML = paletteHTML;
};
