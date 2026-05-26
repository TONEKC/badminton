import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const applicantSessionCookie = "badminton_applicant_session";
export const adminSessionCookie = "badminton_admin_session";

type SessionRole = "applicant" | "admin";

type SessionPayload = {
  role: SessionRole;
  registrationId?: string;
  username?: string;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be at least 16 characters");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSessionSecret());
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function setApplicantSession(registrationId: string) {
  const token = await createSessionToken({ role: "applicant", registrationId });
  const cookieStore = await cookies();
  cookieStore.set(applicantSessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setAdminSession(username: string) {
  const token = await createSessionToken({ role: "admin", username });
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearApplicantSession() {
  const cookieStore = await cookies();
  cookieStore.delete(applicantSessionCookie);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
}

export async function getApplicantSession() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(applicantSessionCookie)?.value,
  );

  if (session?.role !== "applicant" || !session.registrationId) {
    return null;
  }

  return session as { role: "applicant"; registrationId: string };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(adminSessionCookie)?.value,
  );

  if (session?.role !== "admin" || !session.username) {
    return null;
  }

  return session as { role: "admin"; username: string };
}
