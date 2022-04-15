import type { MetaFunction } from "remix";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Nheindev's Personal Website",
    description: "Welcome to remix!",
  };
};

export default function Index() {
  return <h1>gm</h1>;
}
