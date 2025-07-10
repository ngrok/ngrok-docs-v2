import BrowserOnly from "@docusaurus/BrowserOnly";
import { clientOnly$ } from "vite-env-only/macros";
import { useAppliedTheme } from "@ngrok/mantle/theme-provider";

export function ThemeImage({
	darkSrc,
	lightSrc,
	alt,
	className,
}: {
	darkSrc: string;
	lightSrc: string;
	alt: string;
	className?: string;
}): React.ReactElement {
	const currentTheme = useAppliedTheme();
	let imgSrc = lightSrc;

	switch (currentTheme) {
		case "dark":
		case "dark-high-contrast": {
			imgSrc = darkSrc;
			break;
		}
		case "light":
		case "light-high-contrast":
		default: {
			imgSrc = lightSrc;
		}
	}

	return (
    
      clientOnly$(
        <img alt={alt} className={className} src={imgSrc} />
      ) || <span>Loading ...</span>		
	);
}
