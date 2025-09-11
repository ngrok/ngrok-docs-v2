import NgrokCard from "/snippets/components/NgrokCard";
import { useIntegration } from "./integrations/use-integrations";

type Props = {
	name) {
	const integration = useIntegration(name);

	if (!integration) {
		return null;
	}

	return (
		
			{integration.docs.map((doc) => (
				
					
				
			))}
		
	);
}
