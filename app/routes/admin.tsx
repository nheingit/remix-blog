import { Outlet, Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import { Post } from ".prisma/client";
import adminStyles from "~/styles/admin.css";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireUserId(request, "/login");
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
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
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
