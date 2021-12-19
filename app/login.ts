import { json } from "remix";
import { User } from "@prisma/client";
import { Signature, ethers } from "ethers";
import { db } from "~/utils/db.server";
export interface Window {
  ethereum: any;
}

export const getOrCreateUser = async (address: string) => {
  let user = await db.user.findUnique({
    where: {
      address: address,
    },
  });

  // TODO: Log in the user
  if (!user) {
    user = await db.user.create({
      data: {
        address: address.toString(),
        nonce: Math.floor(Math.random() * 10000000),
      },
    });
    return user;
  } else {
    await db.user.update({
      where: {
        address: user.address,
      },
      data: {
        nonce: Math.floor(Math.random() * 10000000),
      },
    });
    return user;
  }
};

export const verifyUser = async (
  user: User,
  signature: string,
  nonce: string
) => {
  let authenticated = false;
  const decodedAddress = ethers.utils.verifyMessage(nonce, signature);
  if (user.address.toLowerCase() === decodedAddress.toLowerCase())
    authenticated = true;
  return authenticated;
};
