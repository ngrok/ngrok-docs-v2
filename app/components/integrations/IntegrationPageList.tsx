import NgrokCard from "@components/NgrokCard";
import { useContext } from "react";
import IntegrationPageListContext, {
  IntegrationPageListContextType,
} from "./IntegrationPageListContext";
import { useLocation } from "@remix-run/react";

type Props = {
  name: string;
};

export default function IntegrationPageList(props: Props) {
  const data = useContext<IntegrationPageListContextType | null>(
    IntegrationPageListContext
  );

  const { pathname } = useLocation();
  if (!data?.pageList) {
    return null;
  }
  const { pageList } = data;

  // console.log("Hello", (data as any).integrationList);

  return (
    <ul className="" role="list">
      {pageList?.map((item) => {
        return item.docs.map((doc) => {
          const splitChar = doc.path.includes("/") ? "/" : "\\";
          const pathParts = doc.path.split(splitChar);
          return (
            <li className="list-none border p-2" key={doc.path}>
              <NgrokCard
                to={pathParts[pathParts.length - 1]}
                size="sm"
                title={doc.headings.find((item: any) => item.depth == 1).value}
                description={doc.frontmatter?.description || doc.excerpt}
              />
            </li>
          );
        });
      })}
    </ul>
  );
}
