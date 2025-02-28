/**
 * Rework this component to just read whatever files are in the directory
 * and list that in the NgrokCard components, that way we
 * don't need to have a bunch of state issues or any weirdness
 */

// import { useIntegration } from "./integrations/use-integrations";
import NgrokCard from "./NgrokCard";

type Props = {
  name: string;
};

export default function IntegrationPageList({ name }: Props) {
  return <p>Integration Page List (temp)</p>;
  // const integration = useIntegration(name);

  // if (!integration) {
  //   return null;
  // }

  // return (
  //   <ul className="m-0 mb-5 grid list-none grid-cols-2 gap-5 p-0" role="list">
  //     {integration.docs.map((doc) => (
  //       <li className="last-of-type:col-span-full" key={doc.path}>
  //         <NgrokCard
  //           to={doc.path}
  //           size="sm"
  //           title={doc.frontMatter?.title || doc.contentTitle}
  //           description={doc.frontMatter?.description || doc.excerpt}
  //         />
  //       </li>
  //     ))}
  //   </ul>
  // );
}
