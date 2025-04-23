import fs from "fs/promises";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

export type Heading = {
  text: string;
  level: number;
  id: string;
};

export async function getHeadings(rawPath: string) {
  try {
    let urlPath = addPluses(rawPath);
    let filePath = path.join(
      process.cwd(),
      "app/routes/docs+/",
      `${urlPath}.mdx`
    );
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
          `/docs+/${urlPath}+/index.mdx`
        );
        markdown = await fs.readFile(filePath + "", "utf8");
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

function addPluses(str: string) {
  let normalizedPath = str;
  if (normalizedPath.indexOf("/") === 0) {
    normalizedPath = normalizedPath.substring(1);
  }
  normalizedPath = normalizedPath.replace("docs/", "");
  normalizedPath = normalizedPath.replace("/", "+/");
  if (normalizedPath[normalizedPath.length - 1] === "/") {
    normalizedPath = normalizedPath.substring(0, normalizedPath.length - 1);
  }
  return normalizedPath;
}

export function getHeadingId(headingText: string) {
  return headingText.toLowerCase().replace(/[^\w]+/g, "-");
}
