import {
  Form,
  redirect,
  ActionFunction,
  useActionData,
  useTransition,
} from "remix";
import { createPost } from "~/post";
import invariant from "tiny-invariant";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("content");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!content) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }
  invariant(typeof title === "string");
  invariant(typeof content === "string");

  await createPost({ title, content });

  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label htmlFor="content">Content:</label>{" "}
        {errors?.content && <em>Content is required</em>}
        <br />
        <textarea rows={20} name="content" />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
