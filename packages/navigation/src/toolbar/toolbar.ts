import { IWidgetControlProps, IEventArgs } from "@itsy-ui/core";

/* Toolbar Widget */
export interface IToolbarControlSchema {
	name: string;
	properties: IToolbarControlSchemaProperties;
}

interface IToolbarControlSchemaProperties {
	"ui:widget": string;
	controlID?: string;
	typeId?: string;
	contextParams?: {};
	data: IToolbarItems[];
}

interface IToolbarItems {
	name: string;
	displayText: string;
	icon?: string;
	isPrimary?: boolean;
}

export interface IToolbarInitEventArgs extends IEventArgs {
	items: any[];
	typeId: string;
}

interface IToolbarRefreshParams {
	contextPath: any;
	context: any;
}

interface IToolbarRefreshEventArgs extends IEventArgs {
	items: any[];
	params: IToolbarRefreshParams;
}

export interface IToolbarWidgetStateProps {
	items: any[];
	typeId: string;
	contextParams: any;
	loaded: boolean;
}

export interface IToolbarStateTransitionProps {
	onToolbarInit: (evt: IToolbarInitEventArgs) => void;
	onToolbarRefresh: (evt: IEventArgs) => void;
	onToolbarCommandExecute: (evt: IEventArgs) => void;
}

export interface IToolbarInitEventArgs extends IEventArgs {
	items: any[];
	typeId: string;
}

export interface IToolbarWidgetDispatchProps extends IWidgetControlProps {
	initToolbar: (typeId: string, contextParams: any) => void;
}

