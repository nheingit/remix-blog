import {
  Form,
  redirect,
  ActionFunction,
  useActionData,
  useTransition,
  json,
} from "remix";
import { createPost } from "~/post";
import { requireUserId } from "~/utils/session.server";
import invariant from "tiny-invariant";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

type PostError = {
  title?: boolean;
  content?: boolean;
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    content: string | undefined;
  };
  fields?: {
    title: string;
    content: string;
  };
};

function validatePostContent(content: string) {
  if (content.length < 10) {
    return `That post is too short`;
  }
}

function validatePostTitle(title: string) {
  if (title.length < 2) {
    return `That title's name is too short`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("content");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!content) errors.content = true;

  if (Object.keys(errors).length) {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }
  invariant(typeof title === "string", "expected title to be a string");
  invariant(typeof content === "string", "expected content to be a string");

  const fieldErrors = {
    title: validatePostTitle(title),
    content: validatePostContent(content),
  };
  const fields = { title, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const newPost = await createPost({ title, content, authorId: userId });

  return redirect(`/posts/${newPost?.id}`);
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <div className="flex justify-between">
      <Form method="post" className="bg-red-200">
        <p>
          <label>
            Post Title: {errors?.title && <em>Title is required</em>}
            <input
              className="bg-gray-200 rounded-lg"
              type="text"
              name="title"
            />
          </label>
        </p>
        <p>
          <label htmlFor="content">Content:</label>{" "}
          {errors?.content && <em>Content is required</em>}
          <br />
          <textarea
            className="bg-gray-200 rounded-lg"
            rows={20}
            name="content"
          />
        </p>
        <p>
          <button type="submit">
            {transition.submission ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
      <h1 className=" w-1/2 bg-blue-200">gm</h1>
    </div>
  );
}
