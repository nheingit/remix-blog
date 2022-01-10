import { Post } from ".prisma/client";
import { redirect } from "@remix-run/server-runtime";
import { db } from "./utils/db.server";

function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export type NewPost = {
  authorId: string;
  title: string;
  content: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

export async function getPosts() {
  return await db.post.findMany();
}

export async function getPost(slug: string) {
  return await db.post.findFirst({
    where: { slug },
  });
}
export async function getPostAuthor(postAuthorId: string) {
  return await db.user.findUnique({
    where: { id: postAuthorId },
  });
}

export async function createPost(post: NewPost): Promise<Post | null> {
  const newPost = await db.post.create({
    data: {
      authorId: post.authorId,
      title: post.title,
      content: post.content,
      slug: convertToSlug(post.title),
    },
  });
  return getPost(newPost.id);
}
