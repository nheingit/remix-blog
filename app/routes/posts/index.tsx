import { Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import { Post } from "@prisma/client";

export const loader = () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id.toString()}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
