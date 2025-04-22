import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ngrok/mantle/tabs";
import React, { useContext } from "react";
import TabListContext from "./TabListContext";

// export default function TabsComponent(props: any) {
//   console.log("Tabs", props);
//   return (
//     <div className="tabs">
//       <div className="tabs__list">{props.children}</div>
//     </div>
//   );
// }

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

type Tab = {
  props: {
    label?: string;
    value?: string;
    children: React.ReactNode[] | React.ReactNode;
  };
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
    const newTabValue =
      tabs[newTabIndex]?.props?.label || tabs[newTabIndex]?.props?.value;

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
          const { label, value } = tabItem.props;
          if (!label && !value) {
            throw new Error("TabItem must have a label or value");
          }
          return (
            <TabsTrigger
              value={label || value}
              role="tab"
              aria-selected={selectedTabItem === label}
              key={`${value}${i}`}
              onClick={handleTabChange}
              ref={(tabControl) => {
                tabRefs.push(tabControl);
              }}
            >
              {label || value}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs?.map((tabItem: any, i: number) => {
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
  tabs: any[],
  localStorageTab: string | null | undefined
) {
  console.log("Localstorage tab", localStorageTab);
  const defaultTab = tabs.find((tab) => {
    console.log("Tab", tab.props.label);
    return (
      tab.props.label === localStorageTab || tab.props.value === localStorageTab
    );
  });
  if (defaultTab) {
    console.log("Returning default tab", defaultTab.props.label);
    return defaultTab.props.label;
  }
  return tabs[0]?.props.label;
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
