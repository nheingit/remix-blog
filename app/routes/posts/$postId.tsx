import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { Post } from "@prisma/client";
import { getPost } from "~/post";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.postId, "expected params.id to exist");
  return await getPost(params.postId);
};

export default function PostSlug() {
  const { title, content } = useLoaderData<Post>();
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
