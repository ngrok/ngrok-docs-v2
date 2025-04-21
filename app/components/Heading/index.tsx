import { getHeadingId } from "~/utils/getHeadings";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as: "h2" | "h3" | "h4";
};

export const Heading = ({ as: Tag, children, ...props }: HeadingProps) => {
  const id = typeof children === "string" ? getHeadingId(children) : undefined;

  return (
    <Tag id={id} {...props}>
      <a href={`#${id}`}>{children}</a>
    </Tag>
  );
};
