const toCamel = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

const generateExports = (palette) => {
  const cssVars = palette
    .map((c) => {
      const name = c.name.trim();
      return `  --${name}: ${c.color};`;
    })
    .join("\n");

  const tailwind = palette
    .map((c) => {
      const name = toCamel(c.name);
      return `  ${name}: '${c.color}',`;
    })
    .join("\n");

  return {
    css: `:root {\n${cssVars}\n}`,
    tailwind: `module.exports = {\n  theme: {\n    extend: {\n${tailwind}\n    }\n  }\n}`,
    json: JSON.stringify(palette, null, 2),
  };
};

const generateSVG = (palette) => {
  const size = 100;
  return `
<svg width="${
    palette.length * size
  }" height="${size}" xmlns="http://www.w3.org/2000/svg">
${palette
  .map(
    (c, i) =>
      `<rect x="${i * size}" y="0" width="${size}" height="${size}" fill="${
        c.color
      }" />`
  )
  .join("\n")}
</svg>`;
};

const getSchemes = async (hex) => {
  const clean = hex.replace("#", "");

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

  const results = {};

  for (const mode of modes) {
    try {
      const res = await fetch(
        `${THECOLORAPI_ENDPOINT}/scheme?hex=${clean}&mode=${mode}&count=5`
      );

      const data = await res.json();

      results[mode] = {
        colors: data.colors || [],
        image: data.image || {},
      };
    } catch {
      results[mode] = { colors: [], image: {} };
    }
  }

  return results;
};
