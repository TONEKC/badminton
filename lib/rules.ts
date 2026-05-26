export const MAX_DOCUMENTS = 5;
export const MAX_DOCUMENT_SIZE = 4 * 1024 * 1024;
export const ALLOWED_DOCUMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export function getRegistrationCloseAt() {
  const raw = process.env.REGISTRATION_CLOSE_AT;
  if (!raw) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error("REGISTRATION_CLOSE_AT must be a valid ISO date string");
  }

  return date;
}

export function isRegistrationOpen(now = new Date()) {
  return now <= getRegistrationCloseAt();
}

export function assertRegistrationOpen(now = new Date()) {
  if (!isRegistrationOpen(now)) {
    throw new Error("Registration deadline has passed");
  }
}

export function getTournamentName() {
  return process.env.TOURNAMENT_NAME || "Bangkok Badminton Open 2026";
}
