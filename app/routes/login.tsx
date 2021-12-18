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
      return address;
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
  console.log(request);
  const address = form.get("ethAddress");
  if (!address || !isAddress(address)) {
    console.log("form.get(address) did not work");
    return;
  }
  let user = await db.user.findUnique({
    where: {
      address: address as string,
    },
  });
  if (user) {
    await db.user.update({
      where: {
        address: user.address,
      },
      data: {
        nonce: Math.floor(Math.random() * 10000000);
      }
    })
  }
  // TODO: Log in the user
  if (!user) {
    user = await db.user.create({
      data: {
        address: address.toString(),
        nonce: Math.floor(Math.random() * 10000000),
      },
    });
  }
  return redirect("/admin");
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();
  async function handleLogin() {
    const ethAddress = await getWeb3();
    const formData = new FormData();
    if (!ethAddress) return "failed to get the address";
    formData.append("ethAddress", ethAddress);
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
        <button onClick={handleLogin}>login</button>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
