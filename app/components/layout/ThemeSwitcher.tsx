import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@ngrok/mantle/select";
import { isTheme, themes, useTheme } from "@ngrok/mantle/theme-provider";
import { Sun } from "@phosphor-icons/react";

export function ThemeSwitcher(props: any) {
  const [currentTheme, setTheme] = useTheme();

  return (
    <div {...props}>
      <Select
        value={currentTheme}
        onChange={(value) => {
          const maybeNewTheme = isTheme(value) ? value : undefined;
          if (maybeNewTheme) {
            setTheme(maybeNewTheme);
          }
        }}
      >
        <div className="ml-auto">
          <span className="sr-only">Theme Switcher</span>
          <SelectTrigger className="w-min">
            <Sun className="mr-1 h-6 w-6" />
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Choose a theme</SelectLabel>
            <SelectItem value={themes[0]}>System</SelectItem>
            <SelectItem value={themes[1]}>Light</SelectItem>
            <SelectItem value={themes[2]}>Dark</SelectItem>
            <SelectItem value={themes[3]}>Light High Contrast</SelectItem>
            <SelectItem value={themes[4]}>Dark High Contrast</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
