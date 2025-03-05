import {
  Accordion,
  AccordionContent,
  AccordionHeading,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerIcon,
} from "@ngrok/mantle/accordion";
import { Card, CardBody } from "@ngrok/mantle/card";
import { Link } from "@remix-run/react";
import type { SidebarItem } from "~/utils/sidebar";
import sidebar from "~/utils/sidebar";

/**
 * TODO:
 * - Check if you can pull the metadata from files
 *  using their path. Meaning, tell remark to parse the file
 *  at the provided path, and get the frontmatter details.
 *  IF so, we can replicate current docusaurus behavior with just providing
 *  the path. We can also replicate its ability to auto-generate a nav section
 *  from a directory
 */

/**
 * TODO:
 * - Make the accordion containing the page you're on open automatically
 * - Scrollto the item representing the page you're on
 * - Make the page you're on highlighted
 */

export const SidebarSection = ({
  sectionItem,
}: {
  sectionItem: SidebarItem;
}) => {
  console.log("Section item", sectionItem);
  return (
    <Accordion type="multiple">
      <AccordionItem value={sectionItem.title}>
        <AccordionHeading asChild>
          <AccordionTrigger>
            {sectionItem.title}
            <AccordionTriggerIcon />
          </AccordionTrigger>
        </AccordionHeading>
        <AccordionContent className="ml-5 flex flex-col">
          {sectionItem.children.map((child: any) => {
            return child.children ? (
              <SidebarSection
                key={child.path || child.title}
                sectionItem={child}
              />
            ) : (
              <Link to={child.path}>{child.title}</Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export function SidebarNav({ className }: any) {
  return (
    <nav className={className}>
      <ul role="list">
        {sidebar &&
          sidebar.map((topLevelItem: SidebarItem) => {
            return (
              <li key={topLevelItem.path || topLevelItem.title}>
                {topLevelItem.children ? (
                  <SidebarSection sectionItem={topLevelItem} />
                ) : (
                  <Link to={topLevelItem.path}>{topLevelItem.title}</Link>
                )}
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
