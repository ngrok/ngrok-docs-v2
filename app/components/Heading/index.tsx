import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { getHeadingId } from "~/utils/getHeadings";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as: "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Heading = ({ as: Tag, children, ...props }: HeadingProps) => {
  const id = typeof children === "string" ? getHeadingId(children) : undefined;
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
