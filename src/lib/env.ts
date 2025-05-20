const Env = {
  APP_URL: import.meta.env.VITE_APP_URL,
  MAX_DAYS_EXPIRATION_WARNING: Number(import.meta.env.VITE_MAX_DAYS_EXPIRATION_WARNING || 7),
  MAX_DAYS_EXPIRATION_DANGER: Number(import.meta.env.MAX_DAYS_EXPIRATION_DANGER || 0),
};

export default Env;
