/**
 * TODO: We can use remarkHeadings to parse the headings rather than the code
 * we have now.
 */

import fs from "fs/promises";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { getRemixPath } from "./pathSanitization";

export type Heading = {
  text: string;
  level: number;
  id: string;
};

export async function getHeadings(rawPath: string) {
  try {
    let urlPath = getRemixPath(rawPath);
    let filePath = path.join(process.cwd(), "app/routes/", `${urlPath}.mdx`);
    let markdown = "";
    try {
      markdown = await fs.readFile(filePath, "utf8");
    } catch (error) {
      try {
        if (urlPath.endsWith("+") || urlPath.endsWith("/")) {
          urlPath = urlPath.substring(0, urlPath.length - 1);
        }
        // If we fail to find the file, check if it's an index.mdx file
        
        filePath = path.join(
          process.cwd(),
          "app/routes",
          `/${urlPath}+/index.mdx`
        );
        try{
          markdown = await fs.readFile(filePath + "", "utf8");        
        } catch (error) {
          // check for index.md instead
          filePath = path.join(
            process.cwd(),
            "app/routes",
            `/${urlPath}+/index.md`
          );
          markdown = await fs.readFile(filePath.replace(".mdx", ".md"), "utf8");
        }
      } catch (error) {
        console.error(
          `Error getting headings. Couldn't read file at ${filePath}`,
          error
        );
        return null;
      }
    }

    const headings: Heading[] = [];

    const tree = unified().use(remarkParse).use(remarkMdx).parse(markdown);

    visit(tree, "heading", (node: any) => {
      const text = node.children
        .map((child: any) => {
          if (!child.children) {
            return child;
          }
          return {
            type: child.children[0].type,
            value: child.children[0].value,
          };
        })
        .filter(
          (child: any) => child.type === "text" || child.type === "inlineCode"
        )
        .map((child: any) => child.value)
        .join("");
      const id = getHeadingId(text);

      const level =
        text.includes("title: ") || text.includes("description: ")
          ? 0
          : node.depth;
      if (level > 1) {
        headings.push({ text, level, id });
      }
    });

    return headings;
  } catch (error) {
    console.error(`Error getting headings for ${rawPath}:`, error);
    return null;
  }
}

export function getHeadingId(headingText: string) {
  return headingText.toLowerCase().replace(/[^\w]+/g, "-");
}
