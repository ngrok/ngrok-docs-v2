import Callout from "@components/Callout";
import DocsCodeBlock from "@components/code-block";
import { Definition } from "@components/Definition";
import { Heading } from "@components/Heading";
import { LangSwitcher } from "@components/LangSwitcher";
import { ContentSwitcher } from "@components/LangSwitcher/ContentSwitcher";
import Tabs from "@components/Tabs";
import TabItem from "@components/Tabs/TabItem";

/* Global components that will:
 * 1. replace existing tags like <code> or <a>
 * 2. be available in all MDX files without needing to import them
 *
 * NOTE: To replace <code> and <pre> you must also add your component to
 * codehike in vite.config.ts
 */
export const globalComponents = {
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
  // replaces <code>
  DocsCodeBlock,
  Callout,
  LangSwitcher,
  ContentSwitcher,
  Definition,
  Tabs,
  TabItem,
};
