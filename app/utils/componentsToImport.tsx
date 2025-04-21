import DocsCodeBlock from "@components/code-block";
import { Heading } from "@components/Heading";

export const components = {
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  DocsCodeBlock,
};
