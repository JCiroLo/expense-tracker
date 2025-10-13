export type EnviromentVariables = {
  APP_ENV: "development" | "production";
  APP_URL: string;
  MAX_DAYS_EXPIRATION_WARNING: number;
  MAX_DAYS_EXPIRATION_DANGER: number;
};

export type Tab = "monthly" | "annual";

export type Dialog =
  | "manage-expense-template"
  | "remove-expense-template"
  | "manage-income-template"
  | "remove-income-template"
  | "global-settings";

export type AccentColor = "ant" | "lime" | "dragonfruit" | "lavender" | "mintice";

export type RouteScope = "REQUIRES_AUTH" | "HIDE_FOR_AUTH";
