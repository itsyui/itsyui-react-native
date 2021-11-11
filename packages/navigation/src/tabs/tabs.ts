import { IEventArgs } from "@itsy-ui/core";
/* Tabs Widget */
interface ITabsControlSchema {
    name: string;
    properties: ITabsControlSchemaProperties;
}

interface ITabsControlSchemaProperties {
    "ui:widget": string;
    controlID?: string;
    tabItems: ITabsItems[];
}

interface ITabsItems {
    title: string;
    name: string;
    content: ITabItemContent;
}

interface ITabItemContent {
    "ui:widget": string;
    controlID?: string;
    contextPath?: {}
    [key: string]: any
}

interface ITabsInitEventArgs extends IEventArgs {
    typeId: string;
    schemaId: string;
    objectData: string;
    relationshipViews: any[];
}

interface ITabsLoadsEventArgs extends IEventArgs {
    data: any;
}

interface ITabsBeforeAddNewTabEventArgs extends IEventArgs {
    previousTabs: any[];
}

interface ITabsAddNewTabAndCloseCurrentTabEventArgs extends IEventArgs {
    Tabs: any[];
    activeKey: string;
}

interface ITabsActiveTabChangeEventArgs extends IEventArgs {
    activeKey: string;
}

export interface ITabsWidgetStateProps {
    tabs: any[];
    data: any[];
    activeKey: string;
    transition: any;
}

export interface ITabsStateTransitionProps {
    onTabsInit: (event: ITabsInitEventArgs) => void;
    onTabsLoad: (event: ITabsLoadsEventArgs) => void;
    onTabsBeforeAddNewTab: (event: ITabsBeforeAddNewTabEventArgs) => void;
    onTabsAddNewTab: (event: ITabsAddNewTabAndCloseCurrentTabEventArgs) => void;
    onTabsActiveTabChange: (event: ITabsActiveTabChangeEventArgs) => void;
    onTabsCloseCurrentTab: (event: ITabsAddNewTabAndCloseCurrentTabEventArgs) => void;
}