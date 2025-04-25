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
    let filePath = path.join(process.cwd(), basePath, `${urlPath}.mdx`);
    let markdown = "";
    try {
      markdown = await fs.readFile(filePath, "utf8");
    } catch (error) {
      try {
        if (urlPath.endsWith("+") || urlPath.endsWith("/")) {
          urlPath = urlPath.substring(0, urlPath.length - 1);
        }
        // If we fail to find the file, check if it's an index.mdx file
        filePath = path.join(process.cwd(), basePath, `${urlPath}+/index.mdx`);
        markdown = await fs.readFile(filePath + "", "utf8");
      } catch (error) {
        // console.error(
        //   `Error getting headings. Couldn't read file at ${filePath}`,
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
