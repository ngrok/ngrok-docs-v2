import fs from "fs/promises";
import path from "path";
import { getFullUrlPath, getRemixPath } from "./pathSanitization";
import remarkHeadings from "@vcarl/remark-headings";
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import { remark } from "remark";

export async function getSidebarItemAtPath(rawPath: string): Promise<{
  frontmatter: any;
  headings: any;
  path: string;
} | null> {
  try {
    let urlPath = getRemixPath(rawPath);
    const basePath = "app/routes/docs+/";
    let mdxFilePath = path.join(process.cwd(), basePath, `${urlPath}.mdx`);
    let mdFilePath = path.join(process.cwd(), basePath, `${urlPath}.md`);
    let markdown = "";
    try {
      try{
        markdown = await fs.readFile(mdxFilePath, "utf8");
      } catch (error) {
        // Check for .md
        markdown = await fs.readFile(mdFilePath, "utf8");
      }
    } catch (error) {      
      try {
        // If we still fail to find the file, check if it's an index file
        if (urlPath.endsWith("+") || urlPath.endsWith("/")) {
          urlPath = urlPath.substring(0, urlPath.length - 1);
        }
        try{
          mdxFilePath = path.join(process.cwd(), basePath, `${urlPath}+/index.mdx`);
          markdown = await fs.readFile(mdxFilePath + "", "utf8");
        } catch (error) {
          mdFilePath = path.join(process.cwd(), basePath, `${urlPath}+/index.md`);
          markdown = await fs.readFile(mdxFilePath.replace(".mdx", ".md"), "utf8");
        }
      } catch (error) {
        // console.error(
        //   `Error getting headings. Couldn't read file at ${mdxFilePath}`,
        //   error
        // );
        return null;
      }
    }

    const fileOfRemark = remark()
      .use(remarkFrontmatter, ["yaml", "toml"])
      .use(remarkParseFrontmatter)
      .use(remarkHeadings)
      .processSync(markdown);

    return {
      path: getFullUrlPath(rawPath),
      frontmatter: fileOfRemark.data?.frontmatter,
      headings: fileOfRemark.data?.headings,
    };
  } catch (error) {
    // console.error(`Error getting headings for ${rawPath}:`, error);
    return null;
  }
}
