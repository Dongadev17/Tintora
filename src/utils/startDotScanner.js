const startDotScanner = (container) => {
  const COUNT = 6;

  const dots = [];
  const trails = [];

  const makeEl = (size) => {
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      pointerEvents: "none",
      mixBlendMode: "screen",
      opacity: "0",
      transition: "opacity .5s ease",
      filter: "blur(1px)",
    });

    container.appendChild(dot);
    return dot;
  };

  const spawnParticle = (x, y, hue) => {
    const p = document.createElement("div");
    const size = 4 + Math.random() * 3;

    Object.assign(p.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      left: `${x}px`,
      top: `${y}px`,
      pointerEvents: "none",
      background: `hsl(${hue}, 70%, 70%)`,
      mixBlendMode: "screen",
      opacity: "0.5",
      transition: "opacity .8s linear, transform .8s linear",
      filter: "blur(2px)",
    });

    container.appendChild(p);

    // trigger fade + drift
    requestAnimationFrame(() => {
      p.style.opacity = "0";
      p.style.transform = `translateY(${3 + Math.random() * 6}px) scale(0.6)`;
    });

    setTimeout(() => p.remove(), 900);
  };

  for (let i = 0; i < COUNT; i++) {
    const size = 14 + Math.random() * 6;
    const dot = makeEl(size);

    dots.push(dot);

    // random start
    let x = Math.random() * container.clientWidth;
    let y = Math.random() * container.clientHeight;

    let hue = Math.random() * 360;

    const animate = () => {
      const tx = Math.random() * container.clientWidth;
      const ty = Math.random() * container.clientHeight;
      const duration = 900 + Math.random() * 900;
      const start = performance.now();

      const loop = (t) => {
        const p = Math.min((t - start) / duration, 1);

        // expo ease
        const e =
          p < 0.5
            ? Math.pow(p * 2, 3) * 0.5
            : 1 - Math.pow((1 - p) * 2, 3) * 0.5;

        const nx = x + (tx - x) * e;
        const ny = y + (ty - y) * e;

        // color shift
        hue = (hue + 0.4) % 360;
        const colorA = `hsl(${hue}, 70%, 70%)`;
        const colorB = `hsl(${(hue + 45) % 360}, 70%, 60%)`;

        dot.style.background = `radial-gradient(circle, ${colorA}, ${colorB})`;
        dot.style.boxShadow = `
          0 0 12px ${colorA},
          0 0 28px ${colorB}80
        `;

        // organic pulse
        const pulse = 1 + Math.sin(t * 0.004 + i) * 0.18;

        dot.style.transform = `translate(${nx}px, ${ny}px) scale(${pulse})`;
        dot.style.opacity = 0.8 + Math.sin(t * 0.003) * 0.15;

        // spawn trailing particles
        if (Math.random() < 0.35) {
          spawnParticle(nx, ny, hue);
        }

        if (p < 1) {
          dot._frame = requestAnimationFrame(loop);
        } else {
          x = nx;
          y = ny;
          setTimeout(animate, 200 + Math.random() * 400);
        }
      };

      dot._frame = requestAnimationFrame(loop);
    };

    setTimeout(() => {
      dot.style.opacity = "1";
      dot.style.transform = `translate(${x}px, ${y}px)`;
      animate();
    }, 200 + i * 120);
  }

  // cleanup
  return () => {
    dots.forEach((dot) => {
      if (dot._frame) cancelAnimationFrame(dot._frame);
      dot.style.opacity = "0";
      setTimeout(() => dot.remove(), 500);
    });
  };
};
