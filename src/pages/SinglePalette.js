const SinglePalettePage = (params, el) => {
  const NoPaletteSelected = html`
    <section
      class="flex flex-col items-center justify-center text-center bg-[#121212] h-[60vh] p-8 mt-10 rounded-3xl border border-[#2A2A2A]"
    >
      <span class="solar--pallete-2-bold-duotone mb-4"></span>
      <h1 class="text-2xl font-semibold text-white mb-2">
        No Palette Selected
      </h1>
      <p class="text-gray-400 text-sm">
        Scan an image to generate and save color palettes.
      </p>
    </section>
  `;

  if (!currentImg) {
    return Layout(NoPaletteSelected, { title: "Palette" });
  }

  const rightSec = html`
    <button
      id="shareBtn"
      class="ripple-container text-blue-400 flex size-12 h-full rounded-3xl items-center justify-center"
    >
      <span class="solar--upload-minimalistic-bold-duotone"></span>
    </button>
    <button
      id="favBtn"
      class="ripple-container ${currentImg?.favorite
        ? "text-yellow-300"
        : "text-gray-400"} flex size-12 h-full rounded-3xl items-center justify-center"
      aria-label="${currentImg?.favorite
        ? "Remove from favorites"
        : "Add to favorites"}"
      title="${currentImg?.favorite
        ? "Remove from favorites"
        : "Add to favorites"}"
    >
      <span class="solar--star-bold-duotone"></span>
    </button>
    <button
      id="deleteBtn"
      class="ripple-container text-red-400 flex size-12 h-full rounded-3xl items-center justify-center"
    >
      <span class="solar--trash-bin-trash-bold-duotone"></span>
    </button>
  `;

  const Content = html`<!-- Display image -->
    <section>
      <div id="scan-image-display" class="mt-2">
        <img
          src="${currentImg.imgSrc}"
          id="paletteImg"
          class="max-h-[190px] mx-auto rounded-2xl shadow-lg mb-2"
        />
      </div>

      <!-- Display palette -->
      <div id="color-palette" class="mt-6 transition-all"></div>
    </section>`;

  afterPageLoad(() => {
    const colorpalette = el.querySelector("#color-palette");
    const deleteBtn = el.querySelector("#deleteBtn");
    const shareBtn = el.querySelector("#shareBtn");

    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        AnimUtils.shake(shareBtn, { intensity: 1.1 });

        const palette = currentImg?.palette || [];
        if (!palette.length) {
          Toast.show("No colors to share yet!");
          return;
        }

        // 🧩 Build preview UI
        const colorGrid = palette
          .map(
            (c) => html`
              <div
                class="flex items-center gap-3 p-2 rounded-xl bg-[#1b1b1b]/70 border border-[#2e2e2e]"
              >
                <div
                  class="w-7 h-7 rounded-md shadow-sm"
                  style="background:${c.color}"
                ></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">
                    ${c.color.toUpperCase()}
                  </p>
                  <p class="text-xs text-gray-400">
                    ${Math.round(c.percentage * 100)}% —${" "}
                    rgb(${c.rgb.join(", ")})
                  </p>
                </div>
              </div>
            `
          )
          .join("");

        const bs = new BottomSheet({
          content: html`
            <div class="pb-6 text-center">
              <h1 class="text-xl font-bold mb-1.5 text-white">Share Palette</h1>
              <p class="text-gray-400 mb-6">
                Here’s your extracted color palette
              </p>
              <div class="grid gap-2 mb-5 text-left">${colorGrid}</div>

              <div class="grid gap-3 font-medium">
                <button
                  id="confirmShare"
                  class="ripple-container py-3 bg-[#4a81f6] text-white rounded-full hover:bg-[#3a6ce3] transition"
                >
                  Share Palette
                </button>
                <button
                  id="cancelShare"
                  class="ripple-container py-3 bg-[#333] text-gray-200 rounded-full transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          `,
        });

        bs.show().then((sheet) => {
          const confirmBtn = sheet.querySelector("#confirmShare");
          const cancelBtn = sheet.querySelector("#cancelShare");

          cancelBtn.addEventListener("click", () => bs.dismiss());

          confirmBtn.addEventListener("click", () => {
            // 🧾 Format share text (minimal but elegant)
            const formatted = palette
              .map(
                (c) =>
                  `${c.color.toUpperCase()} — ${Math.round(
                    c.percentage * 100
                  )}%`
              )
              .join("\n");

            const message = `🎨 My color palette from Tintora:\n\n${formatted}`;
            bs.dismiss().then(async () => {
              await Android.shareText(message, "Shared Palette from Tintora");
            });
          });
        });
      });
    }

    const favBtn = el.querySelector("#favBtn");
    if (favBtn) {
      favBtn.addEventListener("click", async () => {
        AnimUtils.shake(favBtn, { intensity: 1.05 });
        try {
          const stored = await PaletteDB.get(currentImg.id);
          const target = stored || currentImg;
          target.favorite = !target.favorite;
          await PaletteDB.save(currentImg.id, target);
          // UI feedback: update icon and color immediately
          favBtn.classList.toggle("text-yellow-300", target.favorite);
          favBtn.classList.toggle("text-gray-400", !target.favorite);
          favBtn.setAttribute(
            "aria-label",
            target.favorite ? "Remove from favorites" : "Add to favorites"
          );
          favBtn.setAttribute(
            "title",
            target.favorite ? "Remove from favorites" : "Add to favorites"
          );
          if (target.favorite) {
            Toast.show("Added to favorites");
          } else {
            Toast.show("Removed from favorites");
          }
        } catch (err) {
          console.error(err);
          Toast.show("Failed to update favorite");
        }
      });
    }

    if (colorpalette) {
      showPalette(currentImg, el.querySelector("#color-palette"));
    }
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        localStorage.removeItem("imagePalette_" + currentImg.id);
        setTimeout(() => {
          r.navigateTo("home");
        }, 100);
      });
    }
  });

  const truncate = (str, max = 20) =>
    str && str.length > max ? str.slice(0, max) + "…" : str;

  return Layout(Content, {
    title: truncate(currentImg?.name, 7) || "Palette",
    backBtnRoute: "palettes",
    showRightSection: rightSec,
  });
};
