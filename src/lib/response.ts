const Response = {
  success: <D>(data: D) => ({ ok: true, data, error: null }),
  error: <E extends Error>(error: E) => ({ ok: false, data: null, error }),
};

export default Response;
