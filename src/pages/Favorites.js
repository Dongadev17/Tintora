const FavoritesPage = (params, el) => {
  const Content = html`
    <div id="favorites-container" class="pb-24 grid gap-5 sm:grid-cols-2"></div>
  `;

  afterPageLoad(async () => {
    const container = el.querySelector("#favorites-container");

    const palettes = await PaletteDB.getAll();
    const favorites = palettes.filter((p) => p.favorite);

    if (!favorites.length) {
      container.innerHTML = html`
        <section
          class="flex flex-col items-center justify-center text-center bg-[#121212] h-[60vh] p-8 mt-10 rounded-3xl border border-[#2A2A2A]"
        >
          <span class="solar--star-bold-duotone mb-4"></span>
          <h1 class="text-2xl font-semibold text-white mb-2">No Favorites</h1>
          <p class="text-gray-400 text-sm">
            Mark palettes as favorites to see them here.
          </p>
        </section>
      `;
      return;
    }

    const frag = document.createDocumentFragment();

    favorites.forEach((palette) => {
      const card = document.createElement("div");
      card.className =
        "relative no-shake ripple-container group overflow-hidden rounded-3xl border border-[#2A2A2A] shadow-md bg-[#1E1E1E]";
      card.id = `palette_${palette.id}`;

      card.innerHTML = html`
        <img
          src="${palette.palette_image_url}"
          loading="lazy"
          class="w-full rounded-2xl h-26 object-cover"
        />
        <div
          class="absolute inset-x-1.5 bottom-0.5 flex items-center justify-between"
        >
          <p class="text-gray-200 truncate bg-black/40 py-1 px-3 rounded-3xl  ">
            ${palette.name || "Palette"}
          </p>
          <button
            data-id="${palette.id}"
            class="favorite-btn ${palette.favorite
              ? "text-yellow-300"
              : "text-gray-400"}"
            aria-label="${palette.favorite
              ? "Remove from favorites"
              : "Add to favorites"}"
            title="${palette.favorite
              ? "Remove from favorites"
              : "Add to favorites"}"
          >
            <span class="solar--star-bold-duotone"></span>
          </button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-id]");
        if (btn) {
          // toggle favorite
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
            // Remove card if unfavorited
            if (!current.favorite) {
              card.remove();
              Toast && Toast.show && Toast.show("Removed from favorites");
              // If no more favorites, show empty state
              const container = el.querySelector("#favorites-container");
              if (container && container.children.length === 0) {
                container.innerHTML = html`
                  <section
                    class="flex flex-col items-center justify-center text-center bg-[#121212] h-[60vh] p-8 rounded-3xl border border-[#2A2A2A]"
                  >
                    <span class="solar--star-bold-duotone mb-4"></span>
                    <h1 class="text-2xl font-semibold text-white mb-2">
                      No Favorites
                    </h1>
                    <p class="text-gray-400 text-sm">
                      Mark palettes as favorites to see them here.
                    </p>
                  </section>
                `;
              }
            } else {
              Toast && Toast.show && Toast.show("Added to favorites");
            }
          })();
        } else {
          currentImg = palette;
          r.navigateTo("single-palette");
        }
      });

      frag.appendChild(card);
    });

    container.appendChild(frag);
  });

  return Layout(Content, { title: "Favorites" });
};
