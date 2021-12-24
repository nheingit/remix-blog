import { createCookieSessionStorage, redirect } from "remix";
import { db } from "./db.server";
import { User } from ".prisma/client";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { JsonRpcProvider } from "@ethersproject/providers";

dotenv.config();

type LoginRequest = {
  address: string;
  nonce: string;
};

// const signer = provider.getSigner();
// const address = await signer.getAddress();
// const nonce = Math.floor(Math.random() * 10000002).toString();
// const signature = await signer.signMessage(nonce);

export async function login({ address, nonce }: LoginRequest) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.PROVIDER_URL
  );
  const user = await db.user.findUnique({
    where: { address },
  });
  if (!user) return null;
  return user;
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "Noah_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});
export function getUserSession(request: Request) {}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUser;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
