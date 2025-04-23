import {
  Alert,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@ngrok/mantle/alert";
import { Icon } from "@ngrok/mantle/icon";
import {
  ArrowRight,
  CheckCircle,
  LightbulbFilament,
  Warning,
} from "@phosphor-icons/react";
import { Info } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type CalloutProps = {
  children: React.ReactNode | React.ReactNode[];
  type: "info" | "warning" | "danger" | "note" | "success" | "tip" | "default";
  title?: string;
};

export default function Callout({
  title,
  type,
  children,
}: CalloutProps): React.ReactElement {
  if (!children) throw new Error("<Callout/> requires children");
  if (!type || type === "default")
    throw new Error("<Callout/> requires a type. 'default' is not valid.");
  let priority = type;
  switch (priority) {
    case "tip":
      priority = "success";
      break;
    case "note":
      priority = "info";
      break;
    case "danger":
      priority = "warning";
      break;
  }
  // no need for a base title if the type is default
  const baseTitle = type.toUpperCase();
  return (
    <Alert className="max-w-[85%]" priority={priority}>
      <Icon svg={getIcon(type)} />
      <AlertContent>
        <AlertTitle className="mb-1">
          {baseTitle}
          {title && `: ${title}`}
        </AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </AlertContent>
    </Alert>
  );
}

const getIcon = (type: string) => {
  switch (type) {
    case "note":
    case "info":
      return <Icon svg={<Info />} />;
    case "tip":
      return <Icon svg={<LightbulbFilament />} />;
    case "warning":
    case "danger":
      return <Icon svg={<Warning />} />;
    case "success":
      return <Icon svg={<CheckCircle />} />;
    default:
      return <Icon svg={<ArrowRight />} />;
  }
};
