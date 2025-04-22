import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ngrok/mantle/tabs";
import React from "react";

export default function TabsComponent(props: any) {
  console.log("Tabs", props);
  return (
    <div className="tabs">
      <div className="tabs__list">{props.children}</div>
    </div>
  );
}

type TabsProps = {
  groupId?: string;
  queryString?: string;
  children: React.ReactNode[];
};

/**
 * Option 1:
 *  Do all rendering from within this component. Cycle through the tab items
 *  and render the content for each tab item.
 * Option 2:
 *  Render effectively nothing here but the children.
 */

// Just map the tab conent twice

export function NewTabsComponent(props: TabsProps) {
  const defaultTab = getValidDefaultTab(tabValues, localStorageTab);
  const tabToShow = getValidTabToShow(tabValues, selectedValue, defaultTab);
  return (
    <Tabs orientation="horizontal" defaultValue="account" className="w-[400px]">
      <TabsList>
        {props.children?.map((tabItem: any, i: number) => {
          const { label, value } = tabItem.props;
          if (!label && !value) {
            throw new Error("TabItem must have a label or value");
          }
          return (
            <TabsTrigger
              value={label || value}
              role="tab"
              // aria-selected={selectedTabItem === label}
              key={`${value}${i}`}
            >
              {label || value}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {props.children?.map((tabItem: any, i: number) => {
        const { label, value, children } = tabItem.props;
        return (
          <TabsContent value={label || value} key={`${value}${i}`}>
            {children}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function getValidDefaultTab(
  tabs: readonly any[],
  localStorageTab: string | null | undefined
) {
  const defaultTab = tabs.find(
    (tab) =>
      tab.props.label === localStorageTab || tab.props.value === localStorageTab
  );
  if (defaultTab) {
    return defaultTab.label;
  }
  return tabs[0]?.label;
}

function getValidTabToShow(
  tabs: any[],
  selectedValue: string | undefined,
  defaultTab: string | undefined
) {
  if (selectedValue) {
    const selectedTab = tabs.find((tab) => tab.props.label === selectedValue);
    if (selectedTab) {
      return selectedTab.label;
    }
  }
  return defaultTab;
}
