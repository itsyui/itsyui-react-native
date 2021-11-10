import { IWidgetControlProps, IEventArgs } from "@itsy-ui/core";
/* Sidebar Widget */
export interface ISidebarControlSchema {
    name: string;
    properties: {}
}

interface ISidebarControlSchemaProperties {
    "ui:widget": string;
    controlID?: string;
    data?: ISidebarSchema
}

interface ISidebarSchema {
    default: ISidebarSchemaValue[];
    [SidebarId: string]: ISidebarSchemaValue[];
}

interface ISidebarSchemaValue {
    id: string;
    title: string;
    childUrl?: string[];
    className?: string;
    url?: string;
    order?: number | string;
    roles?: string[];
    children?: ISidebarSchemaValue[];
    appIcon?: string;
    icon?: string;
}

interface ISidebarRefreshEventArgs extends IEventArgs {
    sidebarId?: string
}

interface ISidebarCommandExecuteEventArgs extends IEventArgs {
    sidebarId?: string
}
export interface ISiderbarStateProps {
    data: any[],
    selectedKey: any[],
    isExpand: boolean,
}

export interface ISidebarWidgetDispatchProps extends IWidgetControlProps {
    selectSidebarMenuKey: (data: any) => void;
}

export interface ISidebarWidgetStateTransitionProps {
    onSidebarInit: () => void;
    onSidebarRefresh: (event: ISidebarRefreshEventArgs) => void;
    onSidebarCommandExecute: (event: ISidebarCommandExecuteEventArgs) => void;
}
