import { Outlet, Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import { Post } from ".prisma/client";
import adminStyles from "~/styles/admin.css";

export const loader = () => {
  return getPosts();
};

export const links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export default function Admin() {
  const posts = useLoaderData<Post[]>();
  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
