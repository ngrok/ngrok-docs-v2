import { usePluginData } from "@docusaurus/useGlobalData";
import { parseIntegrations } from "/snippets/integrations/schema";

const pluginKey = "ngrok-parse-integrations";

export function useIntegrations() {
	const rawData = usePluginData(pluginKey);
	return parseIntegrations(rawData);
}

export function useIntegration(name) {
	const integrations = useIntegrations();

	// case insensitive search
	return integrations.find(
		(item) => item.name.toLowerCase() === name.toLowerCase(),
	);
}
