import { themes, useTheme } from "@ngrok/mantle/theme-provider";

export function DocsLogo(props: any) {
  const [currentTheme, setTheme] = useTheme();

  const darkModeLogo = <img {...props} src="/docs-logos/ngrok-white.svg" />;
  const lightModeLogo = <img {...props} src="/docs-logos/ngrok-black.svg" />;

  switch (currentTheme) {
    // system
    case themes[0]:
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return darkModeLogo;
      } else {
        return lightModeLogo;
      }
    // light & light high contrast
    case themes[1]:
    case themes[3]:
      return lightModeLogo;
    // dark & dark high contrast
    case themes[2]:
    case themes[4]:
      return darkModeLogo;
  }
}
