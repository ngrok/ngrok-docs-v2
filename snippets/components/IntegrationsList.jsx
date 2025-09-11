import NgrokCard from "/snippets/components/NgrokCard";
import { useIntegrations } from "./integrations/use-integrations";

export const IntegrationsList = () {
	const integrations = useIntegrations();

	return (
		
			{integrations.map((integration) => (
				
					
				
			))}
		
	);
}
