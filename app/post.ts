import { Post } from ".prisma/client";
import { redirect } from "@remix-run/server-runtime";
import { db } from "./utils/db.server";

export type NewPost = {
  title: string;
  content: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

export async function getPosts() {
  return await db.post.findMany();
}

export async function getPost(postId: string) {
  return await db.post.findUnique({
    where: { id: postId },
  });
}

export async function createPost(post: NewPost) {
  const newPost = await db.post.create({
    data: {
      title: post.title,
      content: post.content,
    },
  });
  return getPost(newPost.id);
}
