import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";

import YAML, { type ToStringOptions } from "yaml";
import { LangSwitcher } from "./LangSwitcher";
import DocsCodeBlock from "/snippets/components/code-block";

const showExample = (
	defaultTitle,
	{
		yamlMetastring,
		jsonMetastring,
		title,
		icon,
		snippetText,
	}: ConfigExampleProps,
	yamlConfig,
	jsonConfig,
) => {
	const titleToUse = title || defaultTitle;
	return (
		
			
				{snippetText ? `# ${snippetText}\n${yamlConfig}` : yamlConfig}
			
			
				{snippetText ? `// ${snippetText}\n${jsonConfig}` : jsonConfig}
			
		
	);
};

const getAgentConfig = (
	config,
	yamlOptions,
) => {
	const agentConfigTemplate = {
		endpoints,
			description,
			upstream,
			},
			traffic_policy,
			},
		},
	};
	return {
		yamlConfig, yamlOptions),
		jsonConfig, null, 2),
	};
};

export type ConfigExampleProps = {
	config, unknown>;
	snippetText?: string;
	showLineNumbers?: boolean;
	yamlMetastring?: string;
	jsonMetastring?: string;
	title?: string;
	icon?: ReactNode;
	showAgentConfig?: boolean;
	showTrafficPolicy?: boolean;
};

export const ConfigExample = ({
	// Show the agent config by default
	showAgentConfig = false,
	showTrafficPolicy = true,
	...props
}: ConfigExampleProps) {
	const yamlOptions = {
		indent,
		directives,
		defaultKeyType,
	} as ToStringOptions;
	// This removes the initial --- because having it there
	// makes it annoying to copy/paste this in the dashboard
	const policyYamlConfig = YAML.stringify(props.config, yamlOptions).slice(4);
	const policyJsonConfig = JSON.stringify(props.config, null, 2);

	const policySnippet = showExample(
		"traffic-policy",
		props,
		policyYamlConfig,
		policyJsonConfig,
	);

	const agentConfig = getAgentConfig(props.config, yamlOptions);
	const agentConfigSnippet = showExample(
		"config",
		props,
		agentConfig.yamlConfig,
		agentConfig.jsonConfig,
	);

	// if both false, throw error;
	if (!showTrafficPolicy && !showAgentConfig) {
		throw new Error(
			"ConfigExample error,
		);
	}

	// if only one is true, no need for 
	if (!showAgentConfig) {
		return policySnippet;
	}
	if (!showTrafficPolicy) {
		return agentConfigSnippet;
	}

	return (
		
			{showTrafficPolicy ? (
				
					{policySnippet}
				
			) : null}

			{showAgentConfig ? (
				
					{agentConfigSnippet}
				
			) : null}
		
	);
}
