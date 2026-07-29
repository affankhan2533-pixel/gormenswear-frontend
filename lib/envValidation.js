/**
  Environment Variable Validator
 */

export function validateEnv() {
  const isDev = process.env.NODE_ENV === "development";

  const required = [];

  const optional = [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_GA_ID",
    "NEXT_PUBLIC_CLARITY_ID",
    "NEXT_PUBLIC_META_PIXEL_ID",
  ];

  const missingRequired = required.filter((key) => !process.env[key]);
  const missingOptional = optional.filter((key) => !process.env[key]);

  if (missingRequired.length > 0) {
    const errorMsg = `[Env Error] Missing required environment variables: ${missingRequired.join(", ")}`;
    if (isDev) {
      console.error(errorMsg);
    }
    return { valid: false, missing: missingRequired };
  }

  if (isDev && missingOptional.length > 0) {
    console.warn(`[Env Warning] Optional variables not set: ${missingOptional.join(", ")}`);
  }

  return { valid: true, missing: [] };
}
