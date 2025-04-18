import fs from "fs/promises";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

type Heading = {
  text: string;
  level: number;
  id: string;
};

export async function getHeadings(rawPath: string) {
  try {
    const urlPath = addPluses(rawPath);
    let filePath = path.join(process.cwd(), "app/routes", `${urlPath}.mdx`);
    let markdown = "";
    try {
      markdown = await fs.readFile(filePath, "utf8");
    } catch (error) {
      // If we fail to find the file, check if it's an index.mdx file
      filePath = path.join(
        process.cwd(),
        "app/routes",
        `${urlPath}+/index.mdx`
      );
      markdown = await fs.readFile(filePath + "", "utf8");
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
      const id = text.toLowerCase().replace(/[^\w]+/g, "-");

      const level =
        text.includes("title: ") || text.includes("description: ")
          ? 0
          : node.depth;
      headings.push({ text, level, id });
    });

    return headings;
  } catch (error) {
    console.error(`Error getting headings for ${rawPath}:`, error);
    return null;
  }
}

function addPluses(str: string) {
  const firstSlashIndex = str.indexOf("/");

  if (firstSlashIndex === -1) {
    // No slashes — just add /index
    return str + "/index";
  }

  // Keep everything up to and including the first slash
  const before = str.slice(0, firstSlashIndex + 1);
  const after = str.slice(firstSlashIndex + 1);

  // Add + before every remaining slash
  const modified = after.replace(/\//g, "+/");

  return before + modified;
}
