import { Link } from "/snippets/components/Link";
import { useLocation } from "@docusaurus/router";
import { Button } from "@ngrok/mantle/button";
import { HoverCard } from "@ngrok/mantle/hover-card";
import { Icon } from "@ngrok/mantle/icon";
import {
	ArrowSquareOutIcon,
	LinkSimpleHorizontalIcon,
	QuestionMarkIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";

import { terms } from "./data";

type DefinitionProps = {
	children, the definition will not be rendered on pages
	// where the content most likely already explains the term
	hideIfRedundant?: boolean;
};

function verifyLink(link, linkType){
	if (link && !linkType)
		throw new Error(` link must be a valid URL. Received ${link}`);

	if (link?.includes("localhost))
		throw new Error(
			` link must not be a localhost URL. Received ${link}`,
		);
}

function findMatchingTerm(content) {
	return terms.find((term) => term.titles.includes(content));
}

export function Definition({
	children,
	meaning,
	link,
	className,
	hideIfRedundant,
	wrapperTermString,
}: DefinitionProps){
	if (!children) throw new Error(" requires children");
	const linkType = link?.startsWith("http")
		? "external"
		: link?.startsWith("/")
			? "internal"
			: null;

	verifyLink(link, linkType);

	const parsedWrapperTerm = wrapperTermString
		? JSON.parse(wrapperTermString)
		: null;

	// Don't get the match if the meaning is provided
	const match =
		parsedWrapperTerm || meaning ? null : findMatchingTerm(children.toString());

	const data = match ||
		parsedWrapperTerm || {
			meaning,
			link,
		};

	const { pathname } = useLocation();

	if (data.link && hideIfRedundant) {
		const pathSegments = pathname.split("/");
		const lastPathSegment = pathSegments[pathSegments.length - 2];
		// If the link is in the current path, don't render
		// the definition component. Probably redundant.
		if (lastPathSegment && data.link.includes(lastPathSegment)) {
			return <>{children};
		}

		// If the last path segment matches any of the titles,
		// don't render the definition component. Probably redundant.
		if (
			data.titles.some((title) =>
				lastPathSegment?.includes(title.split(" ").join("-").toLowerCase()),
			)
		) {
			return <>{children};
		}
	}

	const iconSize = 4;

	return (
		
			
				
					<>
						{children}
						
					
				
			
			
				
					{data.meaning}
					{Boolean(data?.link) && (
						
							
								
									{linkType === "external" ? (
										}
										/>
									) : (
										}
										/>
									)}
								
								Learn More
							
						
					)}
				
			
		
	);
}
