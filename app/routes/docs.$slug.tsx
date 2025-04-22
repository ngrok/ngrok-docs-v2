import { json, LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";
import { getHeadings } from "~/utils/getHeadings";

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug; // e.g. 'my-post'
  const filePath = path.join(process.cwd(), "app/routes/docs+", `${slug}.mdx`);
  const mdxContent = await fs.readFile(filePath, "utf8");

  const headings = getHeadings(mdxContent);

  return json({
    headings,
    mdxContent, // pass to MDX renderer
  });
}
