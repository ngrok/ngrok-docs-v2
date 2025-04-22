/**
 * This component is structured a little weirdly for the time being so it can
 * reproduce the behavior of the docusaurus tabs component.
 * This prevents us having to go through the entirety of the docs
 * and replace every existing tabs component.
 * In future, we can refactor this if need be.
 * We can also add more docusaurus functionality, like
 * `querystring` and `groupId` support.
 */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ngrok/mantle/tabs";
import React, { useContext } from "react";
import TabListContext from "./TabListContext";

type TabsProps = {
  groupId?: string;
  queryString?: string;
  children: React.ReactNode[];
};

export default function TabsComponent(props: TabsProps) {
  const tabRefs: (HTMLButtonElement | null)[] = [];
  const { localStorageTab, selectedTabItem, updateSelectedTabItem } =
    useContext(TabListContext);
  // Alphabetize the tabs
  const tabs: any[] = props.children
    .slice(0)
    .sort((a: any, b: any) =>
      a.props.label && b.props.label
        ? a.props.label.localeCompare(b.props.label)
        : -1
    );

  const handleTabChange = (
    event:
      | React.FocusEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabs[newTabIndex]?.props?.label;

    if (newTabValue !== selectedTabItem && updateSelectedTabItem) {
      updateSelectedTabItem(newTabValue);
    }
  };

  const defaultTab = getValidDefaultTab(tabs, localStorageTab);

  const tabToShow = getValidTabToShow(tabs, selectedTabItem, defaultTab);

  return (
    <Tabs orientation="horizontal" defaultValue={defaultTab} value={tabToShow}>
      <TabsList>
        {tabs?.map((tabItem: any, i: number) => {
          const { label } = tabItem.props;
          if (!label) {
            throw new Error("TabItem must have a label");
          }
          return (
            <TabsTrigger
              value={label}
              role="tab"
              aria-selected={selectedTabItem === label}
              key={`${label}${i}`}
              onClick={handleTabChange}
              ref={(tabControl) => {
                tabRefs.push(tabControl);
              }}
            >
              {label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs?.map((tabItem: any, i: number) => {
        const { label, children } = tabItem.props;
        return (
          <TabsContent value={label} key={`${i}${label}`}>
            {children}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function getValidDefaultTab(
  tabs: any[],
  localStorageTab: string | null | undefined
) {
  const defaultTab = tabs.find((tab) => {
    return tab.props.label === localStorageTab;
  });
  if (defaultTab) {
    return defaultTab.props.label;
  }
  const tabWithDefaultProp = tabs.find((tab) => tab.props.default);
  return tabWithDefaultProp?.props?.label || tabs[0]?.props?.label;
}

function getValidTabToShow(
  tabs: any[],
  selectedValue: string | null,
  defaultTab: string | undefined
) {
  if (selectedValue) {
    const selectedTab = tabs.find((tab) => tab.props.label === selectedValue);
    if (selectedTab) {
      return selectedTab.props.label;
    }
  }
  return defaultTab;
}
