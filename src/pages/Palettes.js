const PalettesPage = (params, el) => {
  const Content = html`
    <div id="palettes-container" class="pb-24 grid gap-5 sm:grid-cols-2"></div>
  `;

  afterPageLoad(async () => {
    const palettesContainer = el.querySelector("#palettes-container");
    const selectedCountEl = el.querySelector("#selectedPalettesCount");
    const deleteBtn = el.querySelector("#deletePalettesBtn");
    const selectedIDs = new Set();

    // 🗃 Fetch all saved palettes efficiently
    const palettes = await PaletteDB.getAll();

    // 🩶 Empty state
    if (palettes.length === 0) {
      palettesContainer.innerHTML = html`
        <section
          class="flex flex-col items-center justify-center text-center bg-[#121212] h-[60vh] p-8 mt-10 rounded-3xl border border-[#2A2A2A]"
        >
          <span class="solar--pallete-2-bold-duotone mb-4"></span>
          <h1 class="text-2xl font-semibold text-white mb-2">
            No Palettes Saved
          </h1>
          <p class="text-gray-400 text-sm">
            Scan an image to generate and save color palettes.
          </p>
        </section>
      `;
      deleteBtn.disabled = true;
      return;
    }

    // ⚡ Render all palettes using DocumentFragment
    const frag = document.createDocumentFragment();

    palettes.forEach((palette) => {
      const card = document.createElement("div");
      card.className =
        "relative no-shake ripple-container group overflow-hidden rounded-3xl shadow-xl bg-[#1E1E1E]";
      card.id = `palette_${palette.id}`;

      card.innerHTML = html`
        <img
          src="${palette.palette_image_url}"
          loading="lazy"
          class="w-full rounded-2xl h-26 object-cover"
        />
        <div
          class="absolute inset-x-1 text-sm bottom-1 flex items-center justify-between"
        >
          <p
            class="text-gray-200 truncate bg-[#181818]/80 py-1 px-3 rounded-2xl "
          >
            ${truncate(palette.name, 34) || "Palette"}
          </p>
        </div>
      `;
      frag.appendChild(card);

      // 🖱️ Click & Hold interactions
      utils().detectHold(card, () => toggleSelect(card, palette.id));

      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-id]");
        if (btn) {
          const id = btn.getAttribute("data-id");
          (async () => {
            const current = await PaletteDB.get(id);
            if (!current) return;
            current.favorite = !current.favorite;
            await PaletteDB.save(id, current);
            // UI feedback: update icon and color immediately
            btn.classList.toggle("text-yellow-300", current.favorite);
            btn.classList.toggle("text-gray-400", !current.favorite);
            btn.setAttribute(
              "aria-label",
              current.favorite ? "Remove from favorites" : "Add to favorites"
            );
            btn.setAttribute(
              "title",
              current.favorite ? "Remove from favorites" : "Add to favorites"
            );
            if (current.favorite) {
              Toast && Toast.show && Toast.show("Added to favorites");
            } else {
              Toast && Toast.show && Toast.show("Removed from favorites");
            }
          })();
        } else {
          if (selectedIDs.size > 0) {
            toggleSelect(card, palette.id);
          } else {
            currentImg = palette;
            r.navigateTo("single-palette");
          }
        }
      });
    });

    palettesContainer.appendChild(frag);

    // 🔄 Selection logic
    const toggleSelect = (card, id) => {
      const isSelected = selectedIDs.has(id);
      if (isSelected) {
        selectedIDs.delete(id);
        card.classList.remove("border-sky-500", "border-4", "scale-[1.02]");
      } else {
        selectedIDs.add(id);
        card.classList.add("border-sky-500", "border-4");
      }
      selectedCountEl.textContent =
        selectedIDs.size > 0 ? selectedIDs.size : "";
    };

    deleteBtn.addEventListener("click", () => {
      selectedIDs.forEach(async (id) => {
        await PaletteDB.delete(id).then(() => {
          const card = el.querySelector("#palette_" + id);
          if (card) {
            AnimUtils.zoomOut(card).then(async () => {
              card.remove();
              const palettesLeft = await PaletteDB.getAll();
              if (!palettesLeft.length) {
                location.reload();
              }
            });
          }
        });
      });
      selectedIDs.clear();
      selectedCountEl.textContent = "";
    });
  });

  // 🧭 Right section: delete button
  const rightSec = html`
    <button
      id="deletePalettesBtn"
      class="disabled:opacity-50 ripple-container text-red-400 w-12 rounded-3xl h-full flex items-center justify-center shadow-sm"
      title="Delete selected"
    >
      <span class="solar--trash-bin-trash-bold-duotone text-lg"></span>
    </button>
    <span
      id="selectedPalettesCount"
      class="absolute top-2 px-1 text-center right-1 text-xs bg-red-800 rounded-full text-red-100"
    ></span>
  `;

  return Layout(Content, { title: "All Palettes", showRightSection: rightSec });
};
