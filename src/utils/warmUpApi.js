const warmUpApi = async (endpoints = [], options = {}) => {
  const { timeout = 4000, method = "GET" } = options;

  if (!Array.isArray(endpoints) || !endpoints.length) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  await Promise.allSettled(
    endpoints.map((url) =>
      fetch(url, {
        method,
        mode: "no-cors", // avoid CORS issues for warm-up
        signal: controller.signal,
        cache: "no-store",
      }).catch(() => null)
    )
  );

  clearTimeout(timer);
};

const warmUpApiIdle = (endpoints) => {
  const unique = [...new Set(endpoints)];

  const run = () => warmUpApi(unique);

  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 500);
  }
};
