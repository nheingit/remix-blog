import path from 'path';
import fs from "fs/promises";
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant";
import { marked } from 'marked';


export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
}

export type Post = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
}

const postPath = path.join(__dirname, "..", "posts")

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts() {

  const dir = await fs.readdir(postPath);

  return Promise.all(
    dir.map(async filename => {
      const file = await fs.readFile(path.join(postPath, filename))
      const {attributes} = parseFrontMatter(file.toString())
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title
      }
    })
  )
 
}

export async function getPost(slug: string) {
  const filepath = path.join(postPath, slug + ".md");
  const file = await fs.readFile(filepath)
  const {attributes, body} = parseFrontMatter(file.toString())

  invariant(
    isValidPostAttributes(attributes),
     `Post ${filepath} is missing attributes`
     );
  const html = marked(body)
  return { slug,html, title: attributes.title }
}

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n${post.markdown}`
  await fs.writeFile(
    path.join(postPath, post.slug + '.md'),
    md
  )
  return post.slug
}