const HomePage = (params, el) => {
  const rightSec = html`
    <button
      data-route="about"
      class="ripple-container flex w-13 h-12 h-full rounded-3xl items-center justify-center"
    >
      <span class="solar--settings-bold-duotone"></span>
    </button>
    <button
      data-route="feedback"
      class="ripple-container flex w-13 h-12 h-full rounded-3xl items-center justify-center"
    >
      <span class="solar--chat-square-code-bold-duotone"></span>
    </button>
  `;
  const Content = html`
    <section
      class="flex items-center justify-center min-h-[60vh] bg-[#121212] px-1 pt-5 pb-20"
    >
      <div
        class="w-full max-w-md bg-[#1C1C1C] border-t border-t-[#3e3e3e] border-b border-b-[#2e2e2e] rounded-3xl shadow-lg p-6 text-center "
      >
        <!-- Upload Icon -->
        <div
          class="mx-auto size-20 mb-4 flex items-center justify-center rounded-3xl bg-sky-900/40 text-sky-400 shadow-inner"
        >
          <span class="solar--cloud-upload-bold-duotone text-4xl"></span>
        </div>

        <!-- Title -->
        <h1
          class="text-3xl font-semibold mb-3 text-white tracking-tight leading-snug"
        >
          Upload your image
        </h1>
        <p class="text-sm text-gray-400 mb-8 leading-relaxed">
          Extract a beautiful color palette directly from your photo.
        </p>

        <!-- Upload button -->
        <div id="uploadSection" class="space-y-4">
          <button
            id="scanUploadBtn"
            class="ripple-container w-full py-4 rounded-full font-medium bg-sky-700 hover:bg-sky-600 text-sky-100 focus:ring-2 focus:ring-sky-400 focus:outline-none  duration-200 shadow-md"
          >
            Choose Image
          </button>

          <input
            id="scanFileInput"
            type="file"
            accept="image/*"
            class="hidden"
          />

          <p class="text-xs text-gray-500">
            Supports JPG, PNG, and WebP up to 5 MB
          </p>
        </div>

        <!-- Display image -->
        <div id="scan-image-display" class="w-fit rounded-3xl mt-6"></div>

        <!-- Display palette -->
        <div id="color-palette" class="mt-6"></div>
      </div>
    </section>
  `;

  afterPageLoad(async () => {
    const uploadBtn = el.querySelector("#scanUploadBtn");
    const fileInput = el.querySelector("#scanFileInput");
    const display = el.querySelector("#scan-image-display");
    const uploadSection = el.querySelector("#uploadSection");
    const paletteEl = el.querySelector("#color-palette");
    let paletteName = "";

    const getPaletteName = () =>
      new Promise((resolve, reject) => {
        const namePaletteSheet = new BottomSheet({
          content: html`
            <div class="pb-6 text-center">
              <h1 class="font-semibold text-2xl text-white mb-1 tracking-tight">
                Name your palette
              </h1>
              <p class="opacity-70 text-base mb-6">
                Give your extracted colors a short and clear name.
              </p>

              <input
                id="paletteNameInput"
                type="text"
                placeholder="Enter palette name"
                class="w-full p-4 rounded-xl bg-[#2e2e2e] mb-5"
                autocomplete="off"
              />

              <p
                id="nameErrorMsg"
                class="text-red-400 text-sm text-center my-2"
              ></p>

              <div class="grid grid-cols-2 gap-3 font-medium">
                <button
                  id="confirmName"
                  class="ripple-container py-3 bg-[#4a81f6] text-white rounded-full"
                >
                  Confirm
                </button>
                <button
                  id="cancelName"
                  class="ripple-container py-3 bg-[#333] text-gray-200 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          `,
        });

        namePaletteSheet.show().then((sheet) => {
          const input = sheet.querySelector("#paletteNameInput");
          const confirm = sheet.querySelector("#confirmName");
          const cancel = sheet.querySelector("#cancelName");
          const msg = sheet.querySelector("#nameErrorMsg");

          input.focus();

          cancel.onclick = () => {
            namePaletteSheet.dismiss();
            reject("cancelled");
          };

          confirm.onclick = () => {
            const name = input.value.trim();

            if (!name) {
              AnimUtils.shake(input);
              input.focus();
              if (msg) msg.textContent = "Palette name is required.";
              return;
            }

            // Load existing palette names
            const palettes = Object.keys(localStorage)
              .filter((key) => key.startsWith("imagePalette_"))
              .map((key) => {
                try {
                  return JSON.parse(localStorage.getItem(key));
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            // Check duplicates (case-insensitive)
            const exists = palettes.some(
              (p) => p.name?.toLowerCase() === name.toLowerCase()
            );

            if (exists) {
              AnimUtils.shake(input);
              input.focus();

              // Optional small feedback message (inside sheet content)
              if (msg) msg.textContent = "Name already exists";
              return;
            }

            // Valid name → resolve
            namePaletteSheet.dismiss();
            resolve(name);
          };
        });
      });

    const resetUI = (message = "") => {
      paletteEl.innerHTML = message
        ? `<p class="text-red-400 mt-4">${message}</p>`
        : "";
      AnimUtils.zoomIn(uploadSection);
    };

    // Android/native upload
    window.onFileSelectedBase64 = async (payloadStr) => {
      try {
        const payload = JSON.parse(payloadStr);
        if (!payload?.base64) return resetUI("No image data found.");

        const imageSrc = `data:${payload.mime};base64,${payload.base64}`;
        display.innerHTML = html`
          <div class="relative inline-block">
            <img
              src="${imageSrc}"
              class="max-h-[280px] mx-auto rounded-3xl shadow-lg object-cover duration-300"
              loading="lazy"
            />

            <!-- Scanner dots container -->
            <div
              id="scannerDots"
              class="absolute inset-0 pointer-events-none"
            ></div>
          </div>
        `;

        try {
          paletteName = await getPaletteName(); // ← stops until confirm
        } catch (err) {
          return resetUI("Palette naming cancelled.");
        }

        const loadingSheet = new BottomSheet({
          disable: true,
          content: html`<div class="pb-5 text-center animate-fadeIn">
            <h1 class="font-bold text-xl mb-1 text-white">Extracting colors</h1>
            <p class="opacity-70 animate-pulse text-base">Please wait...</p>
          </div>`,
        });

        const clearShimmer = AnimUtils.addShimmer(display, { angle: 90 });

        await AnimUtils.zoomOut(uploadSection, { keepState: true });
        uploadSection.remove();
        await AnimUtils.zoomIn(display);
        const scannerContainer = display.querySelector("#scannerDots");
        const stopScanner = startDotScanner(scannerContainer);
        await loadingSheet.show().then((sh) => {
          const p = sh.querySelector("h1");
          AnimUtils.addTextShimmer(p, {
            baseColor: "#fff",
            shimmerColor: "#ffffff28",
            duration: 4,
          });
        });
        sheet = loadingSheet;

        // API call
        const paletteData = await getColorPaletteFromBase64(imageSrc);
        paletteData.imgSrc = imageSrc;
        paletteData.id = utils().id();
        paletteData.name = paletteName;
        await PaletteDB.save(paletteData.id, paletteData);

        currentImg = paletteData;
        loadingSheet.setDisable(false);
        await sheet.dismiss();
        stopScanner();
        clearShimmer();
        setTimeout(() => r.navigateTo("single-palette"), 200);
      } catch (err) {
        console.error("Palette extraction failed:", err);
        resetUI("Failed to extract palette. Please try again.");
      }
    };

    // Fallback: standard web upload
    uploadBtn.addEventListener("click", (e) => {
      if (window.Android?.uploadFile) {
        window.Android.uploadFile("image/*");
      } else {
        e.stopPropagation();
        fileInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
    });

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        return resetUI("File too large (max 5 MB).");
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const imageSrc = reader.result; // full data URI (data:image/jpeg;base64,...)

        // ---- 1. SHOW image preview ----
        display.innerHTML = html`
          <div class="relative inline-block">
            <img
              src="${imageSrc}"
              class="max-h-[280px] mx-auto rounded-3xl shadow-lg object-cover duration-300"
              loading="lazy"
            />

            <div
              id="scannerDots"
              class="absolute inset-0 pointer-events-none"
            ></div>
          </div>
        `;

        // ---- 2. Ask for palette name ----
        try {
          paletteName = await getPaletteName();
        } catch (err) {
          return resetUI("Palette naming cancelled.");
        }

        // ---- 3. Loading bottom sheet ----
        const loadingSheet = new BottomSheet({
          disable: true,
          content: html`<div class="pb-5 text-center animate-fadeIn">
            <h1 class="font-bold text-xl mb-1">Extracting colors</h1>
            <p class="opacity-70 animate-pulse text-base">Please wait...</p>
          </div>`,
        });

        const clearShimmer = AnimUtils.addShimmer(display, { angle: 90 });

        await AnimUtils.zoomOut(uploadSection, { keepState: true });
        uploadSection.remove();
        await AnimUtils.zoomIn(display);

        const scannerContainer = display.querySelector("#scannerDots");
        const stopScanner = startDotScanner(scannerContainer);
        await loadingSheet.show().then((sh) => {
          const p = sh.querySelector("h1");
          AnimUtils.addTextShimmer(p, {
            baseColor: "#fff",
            shimmerColor: "#ffffff28",
            duration: 4,
          });
        });
        sheet = loadingSheet;

        // ---- 4. Extract palette (WEB API) ----
        try {
          const paletteData = await getColorPaletteFromBase64(imageSrc);
          paletteData.imgSrc = imageSrc;
          paletteData.id = utils().id();
          paletteData.name = paletteName;

          await PaletteDB.save(paletteData.id, paletteData);

          currentImg = paletteData;
          loadingSheet.setDisable(false);
          await sheet.dismiss();
          stopScanner();
          clearShimmer();

          setTimeout(() => r.navigateTo("single-palette"), 200);
        } catch (err) {
          console.error("Color extraction error:", err);
          resetUI("Failed to extract palette. Please try again.");

          stopScanner();
          clearShimmer();
        }
      };

      reader.readAsDataURL(file);
    });
  });

  return Layout(Content, { showBackBtn: false, showRightSection: rightSec });
};
