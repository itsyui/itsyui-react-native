import { IWidgetControlProps, IEventArgs } from "@itsy-ui/core";
/* Navbar Widget */
export interface INavbarControlSchema {
    name: string;
    properties: INavbarControlSchemaProperties;
}

interface INavbarControlSchemaProperties {
    "ui:widget": string;
    controlID?: string;
    data?: INavbarSchema;
}

interface INavbarSchema {
    items: INavbarSchemaItems[];
    rightItems: INavbarSchemaItems[];
}

interface INavbarSchemaItems {
    id: string;
    title: string;
    isPrimary?: boolean;
    "ui:widget?": string;
    url?: string;
}

interface INavbarItemClickEventArgs extends IEventArgs {
    data: { [key: string]: any };
}

interface INavbarRefreshEventArgs extends IEventArgs {
    data: { [key: string]: any };
}

interface INavbarCommandExecute extends IEventArgs {
    data: { [key: string]: any };
}

export interface INavbarWidgetStateProps {
    data: { [key: string]: any };
    selectedItems: any[];
}

export interface INavbarWidgetDispatchProps extends IWidgetControlProps {
    navItemClick: (data: any) => void;
}

export interface INavbarWidgetStateTransitionProps {
    onNavbarInit: () => void;
    onNavbarRefresh: (event: INavbarRefreshEventArgs) => void;
    onNavbarCommandExecute: (event: INavbarCommandExecute) => void;
}


export interface INavbarAppIconStateUpdate {
    navbarLoad: () => void;
}
