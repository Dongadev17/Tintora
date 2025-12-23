const enrichPaletteData = async (paletteData) => {
  if (!paletteData?.palette?.length) return paletteData;

  // Prevent re-enrichment
  if (paletteData._enriched) return paletteData;

  // --- Enrich each color ---
  const enrichedPalette = await Promise.all(
    paletteData.palette.map(async (c) => {
      const info = await ColorAPI.get(c.color);

      return {
        ...c,
        name: info?.name?.value || null,
        hsl: info?.hsl || null,
        contrast: info?.contrast || null,
        luminance: info?.luminance || null,
      };
    })
  );

  // --- Generate schemes once (based on dominant color) ---
  const baseColor = paletteData.palette[0]?.color;
  let schemes = null;

  if (baseColor) {
    const clean = baseColor.replace("#", "");
    const modes = [
      "monochrome",
      "monochrome-dark",
      "monochrome-light",
      "analogic",
      "complement",
      "analogic-complement",
      "triad",
      "quad",
    ];

    schemes = {};
    for (const mode of modes) {
      const res = await fetch(
        `${THECOLORAPI_ENDPOINT}/scheme?hex=${clean}&mode=${mode}&count=5`
      );
      schemes[mode] = await res.json();
    }
  }

  // --- Generate exports once ---
  const exports = generateExports(enrichedPalette);
  const svg = generateSVG(enrichedPalette);

  return {
    ...paletteData,
    palette: enrichedPalette,
    schemes,
    exports: {
      ...exports,
      svg,
    },
    _enriched: true, // 🔒 flag to avoid re-calls
  };
};
