import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { getHeadingId } from "~/utils/getHeadings";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Heading = ({ as: Tag, children, ...props }: HeadingProps) => {
  let id = "";

  if (typeof children === "string") {
    id = getHeadingId(children);
  } else if (typeof children === "object") {
    try {
      if (Array.isArray(children)) {
        const normalizedValue = (children as React.ReactElement[]).reduce(
          (acc, child) => {
            if (typeof child === "string") {
              return acc + child;
            } else if (typeof child === "object" && child.props) {
              return acc + child.props.children;
            }
            return acc;
          },
          ""
        );
        id = getHeadingId(normalizedValue);
      } else {
        const normalizedValue = (children as React.ReactElement).props.children;
        id = getHeadingId(normalizedValue);
      }      
    } catch (error) {
      console.error("Error getting heading ID:", error);
    }
  }

  const { hash } = useLocation();

  useEffect(() => {
    if (id && hash === `#${id}`) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [id]);

  return (
    <Tag id={id} {...props}>
      <a href={`#${id}`}>{children}</a>
    </Tag>
  );
};
