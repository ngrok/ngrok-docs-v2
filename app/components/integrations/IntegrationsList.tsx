import type { Integration } from "~/utils/Integrations/getIntegrations";
import NgrokCard from "../NgrokCard";

export default function IntegrationsList({ list }: { list: Integration[] }) {
  if (!list || list.length === 0) {
    console.warn("No integrations found in the list");
    return null;
  }
  return (
    <ul className="m-0 mb-5 grid list-none grid-cols-2 gap-5 p-0" role="list">
      {list.map((integration) => (
        <li className="last-of-type:col-span-full" key={integration.name}>
          <NgrokCard
            to={integration.path}
            size="sm"
            img={integration.metadata?.logo}
            title={integration.metadata?.sidebar_label || integration.name}
            description={integration.metadata?.excerpt}
          />
        </li>
      ))}
    </ul>
  );
}
