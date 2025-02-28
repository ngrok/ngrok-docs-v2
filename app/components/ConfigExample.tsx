import { clientOnly$ } from "vite-env-only/macros";
// import { useMDXComponents } from "@mdx-js/react";
import TabItem from "@components/Tabs/TabItem";
import Tabs from "@components/Tabs";
// import { createElement, type ReactNode } from "react";
import YAML, { type ToStringOptions } from "yaml";
import DocsCodeBlock, { CodeBlockFallback } from "./code-block";

const showExample = (
  defaultTitle: string,
  {
    yamlMetastring,
    jsonMetastring,
    title,
    icon,
    snippetText,
  }: ConfigExampleProps,
  yamlConfig: string,
  jsonConfig: string
) => {
  const titleToUse = title || defaultTitle;
  return (
    <Tabs className="mb-4" groupId="config_example" queryString="config">
      <TabItem value="YAML" label="YAML">
        {clientOnly$(
          <DocsCodeBlock
            language="yaml"
            metastring={yamlMetastring}
            title={titleToUse + ".yml"}
            icon={icon}
          >
            {snippetText ? `# ${snippetText}\n` + yamlConfig : yamlConfig}
          </DocsCodeBlock>
        ) || <CodeBlockFallback className="mb-4">Loading…</CodeBlockFallback>}
      </TabItem>
      <TabItem value="JSON" label="JSON">
        {clientOnly$(
          <DocsCodeBlock
            language="json"
            metastring={jsonMetastring}
            title={titleToUse + ".json"}
            icon={icon}
          >
            {snippetText ? `// ${snippetText}\n` + jsonConfig : jsonConfig}
          </DocsCodeBlock>
        ) || <CodeBlockFallback className="mb-4">Loading…</CodeBlockFallback>}
      </TabItem>
    </Tabs>
  );
};

const getAgentConfig = (
  config: ConfigExampleProps["config"],
  yamlOptions: ToStringOptions
) => {
  const agentConfigTemplate = {
    endpoints: {
      name: "my-agent-endpoint",
      description: "Example Agent Endpoint with a Traffic Policy",
      upstream: {
        url: 80,
      },
      traffic_policy: {
        ...config,
      },
    },
  };
  return {
    yamlConfig: YAML.stringify(agentConfigTemplate, yamlOptions),
    jsonConfig: JSON.stringify(agentConfigTemplate, null, 2),
  };
};

export type ConfigExampleProps = {
  config: Record<string, unknown>;
  snippetText?: string;
  showLineNumbers?: boolean;
  yamlMetastring?: string;
  jsonMetastring?: string;
  title?: string;
  icon?: ReactNode;
  showAgentConfig?: boolean;
};

export default function ConfigExample(props: ConfigExampleProps) {
  const { config, showAgentConfig } = props;
  // const components = useMDXComponents();

  const yamlOptions = {
    indent: 2,
    directives: true,
    defaultKeyType: "PLAIN",
    // I'm removing the initial --- because having it there
    // makes it annoying to copy/paste this in the dashboard
  } as ToStringOptions;
  const policyYamlConfig = YAML.stringify(config, yamlOptions).slice(4); // Remove the initial `---\n` from the YAML output
  const policyJsonConfig = JSON.stringify(config, null, 2);

  let defaultTitle = "traffic-policy";
  const policySnippet = showExample(
    defaultTitle,
    props,
    policyYamlConfig,
    policyJsonConfig
  );

  /**
   * Make showExample generic, accepting:
   * - props
   * - yamlConfig,
   * - jsonConfig
   * Returns the tabs component
   * Then we can pass in the policy content and the agent config content
   */

  const agentConfig = getAgentConfig(config, yamlOptions);
  defaultTitle = "config";
  const agentConfigSnippet = showExample(
    defaultTitle,
    props,
    agentConfig.yamlConfig,
    agentConfig.jsonConfig
  );
  // This code previously existed so we could add the H3s
  // created below to the TOC. That was docusaurus-specific.
  // Must find a new way to do this for remix.
  // if (!components.h3) {
  //   console.log("Components", components);
  //   return <p>Error rendering config example.</p>;
  // }
  return (
    <>
      {showAgentConfig && (
        <>
          <p>You can use one of the following:</p>
          <h3>Policy</h3>
          {/* The following code existed previously so the H3 labeling this code block
          would be added to the toc. That was required for docusaurus. I assume that
          for remix there'll be another way forward.
          As of now, these H3s don't go in the TOC and can't be linked to */}
          {/* {createElement(components.h3, { id: "policy" }, "Policy")} */}
        </>
      )}
      {policySnippet}
      {showAgentConfig ? (
        <>
          <h3>Agent Config</h3>
          {/* See comment above */}
          {/* {createElement(components.h3, { id: "agent-config" }, "Agent Config")} */}
          {agentConfigSnippet}
        </>
      ) : null}
    </>
  );
}
