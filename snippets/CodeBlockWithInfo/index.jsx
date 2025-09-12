import useBaseUrl from "@docusaurus/useBaseUrl";
import { CodeBlock, fmtCode } from "@ngrok/mantle/code-block";
import clsx from "clsx";

import { SdkButton } from "../LangSwitcher/SdkButton";

type CodeBlockWithInfoProps = {
	content,
	language,
	collapseLineNumber,
	meta,
	className,
	headerContent,
	info,
	codeBlockProps,
}: CodeBlockWithInfoProps) {
	const collapsible = !meta
		? false
		: meta.collapsible &&
			content &&
			content.split("\n").length > collapseLineNumber;

	return (
		
			
				
					{meta?.title && (
						
							<>
								{meta?.mode ? (
									
								) : (
									
								)}
								
									{meta?.titleLink ? (
										
											{meta.title}
										
									) : (
										{meta.title}
									)}
								
							
						
					)}
					{headerContent}
					{info && }
				
				
					{!meta?.disableCopy && }
					
					{collapsible && }
				
			
		
	);
}
