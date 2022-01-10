import { redirect, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { Post } from "@prisma/client";
import { getPost, getPostAuthor } from "~/post";
import invariant from "tiny-invariant";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.postSlug, "expected params.postSlug to exist");

  const post = await getPost(params.postSlug);
  if (!post)
    throw new Response("Not Found", {
      status: 404,
    });
  if (!post.published) {
    invariant(post.authorId, "expected authorid to exist");
    const postAuthor = await getPostAuthor(post.authorId);
    const userId = await requireUserId(request, "/");
    console.log(postAuthor?.id, userId);
    if (postAuthor?.id !== userId)
      throw new Response("Not Found", {
        status: 404,
      });
  }
  return post;
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
