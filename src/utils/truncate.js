const truncate = (str, max = 20) =>
  str && str.length > max ? str.slice(0, max) + "…" : str;
