import { Link } from "/snippets/components/Link";
import { clsx } from "clsx";

const cardSizes = ["xs", "sm", "md", "lg", "xl"];

type CardHeaderProps = {
	size?: CardSize;
	title, title }: CardHeaderProps) {
	switch (size) {
		case "xs":
		case "sm":
			return {title};

		case "xl":
			return {title};

		default="fw-600">{title};
	}
}

type CardHeadingProps = {
	icon, size, title }: CardHeadingProps) {
	if (icon) {
		return (
			
				{title && }
				{icon}
			
		);
	}

	if (title) {
		return (
			
				
			
		);
	}

	return null;
}

type Props = {
	description?: string | undefined;
	icon?: React.ReactNode;
	img?: string;
	imgAlt?: string;
	note?: boolean;
	size?: CardSize;
	title,
	icon,
	img,
	imgAlt,
	note = false,
	size,
	title,
	to,
}: Props) {
	return (
		
				{img && }
				
				{description && {description}}
			
		
	);
}
