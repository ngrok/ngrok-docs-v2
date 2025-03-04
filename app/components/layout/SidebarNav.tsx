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
import sidebar from "~/utils/sidebar";

export function SidebarNav({ className }: any) {
  return (
    <nav className={className}>
      <ul role="list">
        {sidebar &&
          sidebar.map((section) => {
            return (
              <li key={section.title}>
                <Accordion type="multiple">
                  <AccordionItem value={section.title}>
                    <AccordionHeading asChild>
                      <AccordionTrigger>
                        {section.title}
                        <AccordionTriggerIcon />
                      </AccordionTrigger>
                    </AccordionHeading>
                    <AccordionContent className="ml-5 flex flex-col">
                      {section.links &&
                        section.links.map((link: any) => (
                          <Link to={link.href}>{link.title}</Link>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
