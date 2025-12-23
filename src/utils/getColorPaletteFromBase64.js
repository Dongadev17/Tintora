const getColorPaletteFromBase64 = async (base64Image) => {
  // ---- 1. Convert Base64 → Image element ----
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = base64Image;
  });

  // ---- 2. Draw on canvas (for compression) ----
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // optional resize (prevent huge 4000px images)
  const MAX_SIZE = 1200;
  let { width, height } = img;

  if (width > MAX_SIZE || height > MAX_SIZE) {
    const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  // ---- 3. Compress to JPEG ----
  const compressedBlob = await new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/jpeg",
      0.65 // compression quality (0.6–0.75 recommended)
    )
  );

  // ---- 4. Send compressed blob ----
  const formData = new FormData();
  formData.append("file", compressedBlob, "image.jpg");

  const res = await fetch(OYYI_ENDPOINT, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  return await res.json();
};
