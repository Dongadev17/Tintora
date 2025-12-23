const Header = (
  showBackBtn = true,
  title = "Tintora",
  showRightSection = "",
  backBtnRoute = "home"
) => {
  const backBtn = !showBackBtn
    ? html`<div class="w-0"></div>`
    : html`
        <button
          data-route="${backBtnRoute}"
          class="ripple-container flex items-center justify-center size-12 rounded-3xl bg-[#2A2A2A]/60 border-t border-t-[#3e3e3e] border-b border-b-[#2e2e2e] shadow-sm"
          aria-label="Go back"
        >
          <span
            class="solar--arrow-left-line-duotone text-xl text-gray-100"
          ></span>
        </button>
      `;

  const rightSection = showRightSection
    ? html`
        <div
          class="flex items-center justify-end h-12 rounded-3xl bg-[#2A2A2A]/60 border-t border-t-[#3e3e3e] border-b border-b-[#2e2e2e] backdrop-blur-sm shadow-lg"
        >
          ${showRightSection}
        </div>
      `
    : html`<div class="w-0"></div>`;

  return html`
    <header
      class="flex sticky top-1 z-50 justify-between items-center gap-3 px-1 py-3"
    >
      <!-- Title Section -->
      <div
        class="backdrop-blur-sm shadow-lg rounded-full flex items-center justify-start gap-3 pr-4 h-12"
      >
        <!-- Back Button -->
        ${backBtn}
        <h1
          class="text-3xl ${!showBackBtn
            ? "font-medium"
            : ""} text-gray-200 tracking-tight truncate select-none"
        >
          ${title}
        </h1>
      </div>

      <!-- Right Section (optional) -->
      ${rightSection}
    </header>
  `;
};
