const ColorCard = (c) => {
  const textColor = c.contrast.value;
  const rgbText = c.rgb?.length
    ? `rgb(${c.rgb.join(", ")})`
    : c.rgb.value || "Unknown";
  const percentage = c.percentage ? `${(c.percentage * 100).toFixed(1)}%` : "";
  const bgColor = c.color || c.hex.value;
  const colorName = c.name.value || c.name || "Unknown";

  return html`
    <div
      data-color="${bgColor}"
      class="ripple-container no-shake rounded-3xl border border-[#1e1e1e] shadow-lg"
      style="background:${bgColor}; color:${textColor}"
      title="Tap to copy ${bgColor}"
    >
      <div
        style="color: ${c.contrast.value}"
        class="p-2 flex flex-col items-center justify-between h-full rounded-2xl bg-black/10"
      >
        <span class="text-base font-semibold">${bgColor}</span>
        <span class="text-sm opacity-65 font-medium">${colorName}</span>
        <span class="text-xs opacity-50 font-mono mt-1">${rgbText}</span>
        ${percentage
          ? html`<span
              class="text-[10px] mt-1 px-2 py-0.5 rounded-full font-bold bg-black/20"
            >
              ${percentage}
            </span>`
          : ""}
      </div>
    </div>
  `;
};
