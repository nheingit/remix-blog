import {
  LinksFunction,
  ActionFunction,
  useActionData,
  json,
  redirect,
  useTransition,
  useSubmit,
  Form,
} from "remix";
import { Link, useSearchParams } from "remix";
import { ethers } from "ethers";
import stylesUrl from "../styles/login.css";
import { useState } from "react";
import { db } from "~/utils/db.server";
import { getOrCreateUser, verifyUser } from "~/login";
import invariant from "tiny-invariant";
import { createUserSession } from "~/utils/session.server";
declare global {
  interface Window {
    ethereum: any;
  }
}
type ActionData = {
  formError?: string;
  fieldErrors?: {
    address: string | undefined;
  };
  fields?: {
    address: string;
  };
};
const getWeb3 = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const nonce = Math.floor(Math.random() * 10000002).toString();
      const signature = await signer.signMessage(nonce);
      return [address, signature, nonce];
    } else {
      // TODO: make a more robust error here
      return console.error(
        "there was no window.ethereum, please install MetaMask/Phantom"
      );
    }
  } catch (error) {
    console.log(
      "Not sure what would happen here, but there's an error: ",
      error
    );
  }
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

function isAddress(address: unknown) {
  if (typeof address !== "string" || address.length !== 42) {
    return false;
  } else {
    return true;
  }
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const address = form.get("ethAddress");
  const signature = form.get("signature");
  const nonce = form.get("nonce");
  if (!signature || typeof signature !== "string")
    return new Error("no signature provided");
  if (!address || !isAddress(address)) {
    console.log("form.get(address) did not work");
    return;
  }
  if (!nonce || typeof nonce !== "string") return new Error("no nonce found");
  const user = await getOrCreateUser(address as string);
  const isAuthenticated = await verifyUser(user, signature, nonce);
  if (!isAuthenticated) return console.log("user is not authenticated");
  return createUserSession(user.id, "/admin");
};

export default function Login() {
  const actionData = useActionData();
  const submit = useSubmit();
  async function handleRegister() {
    // @ts-ignore
    const [ethAddress, signature, nonce] = await getWeb3();

    const formData = new FormData();
    if (!ethAddress || !signature || !nonce) return badRequest(actionData);
    formData.append("ethAddress", ethAddress);
    formData.append("signature", signature);
    formData.append("nonce", nonce);
    submit(formData, {
      action: "login/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  }

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <button onClick={handleRegister}>Login with MetaMask</button>
      </div>
      <div className="links">
        <ul>
          <li>{}</li>
        </ul>
      </div>
    </div>
  );
}
