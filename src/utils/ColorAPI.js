const ColorAPI = {
  _cache: new Map(),

  async get(hex) {
    const clean = hex.replace("#", "").toUpperCase();
    if (this._cache.has(clean)) return this._cache.get(clean);

    try {
      const res = await fetch(`${THECOLORAPI_ENDPOINT}/id?hex=${clean}`);
      const data = await res.json();
      this._cache.set(clean, data);
      return data;
    } catch {
      return null;
    }
  },
};
