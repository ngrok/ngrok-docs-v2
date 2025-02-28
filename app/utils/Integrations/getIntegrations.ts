import fs from "fs";
import path from "path";
import { readFile } from "node:fs/promises";
import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { fileToPath } from "~/utils/docusaurusUtils";
import { remark } from "remark";
import remarkParseFrontmatter from "remark-parse-frontmatter";

export type Integration = {
  name: string;
  path: string;
  docs: any[];
  metadata: any;
};

export const getIntegrations = async (): Promise<Integration[] | undefined> => {
  const remixPathString = "./app/routes/docs+";
  const plainPathString = "/docs";
  const integrationsDir = path.join(remixPathString, "integrations+");
  const integrationList = [];

  const dir = await fs.promises.opendir(integrationsDir);
  for await (const dirent of dir) {
    const integrationDir = path.join(integrationsDir, dirent.name);
    const isFile = fs.lstatSync(integrationDir).isFile();
    if (isFile) {
      continue;
    }
    const integration: Integration = {
      name: dirent.name,
      path: dirent.name,
      docs: [],
      metadata: null,
    };

    fs.readdirSync(integrationDir).flatMap(async (x) => {
      const filePath = path.join(integrationDir, x);

      // Ignore index files, folders and non-markdown files
      const isFile = fs.lstatSync(filePath).isFile();
      if (!isFile || x.indexOf(".md") < 0) {
        return;
      }

      // Parse markdown
      const fileContent = fs.readFileSync(filePath).toString();

      // With Remark, which is built on top of Unified, basically by adding remarkParse and remarkStringify.

      const fileOfRemark = remark()
        .use(remarkFrontmatter, ["yaml", "toml"])
        .use(remarkParseFrontmatter)
        .processSync(fileContent);

      // Add file details as metadata information on integration
      if (x === "index.mdx") {
        integration.metadata = fileOfRemark.data.frontmatter;
        return;
      }

      const pathOfX = fileToPath(x);

      // Add file details as doc on integration
      integration.docs.push({
        // clean up things like .md
        path: path.join(plainPathString, "integrations", pathOfX),
        ...fileOfRemark.data,
      });
    });

    integrationList.push(integration);
  }

  return integrationList.sort((a, b) => a.name.localeCompare(b.name));
};
