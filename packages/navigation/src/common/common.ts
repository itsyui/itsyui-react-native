import { IEventArgs } from "@itsy-ui/core";
/* Drawer */
interface IControlSchema {
    name: string;
    properties: IControlSchemaProperties;
}

interface IControlSchemaProperties {
    "ui:widget": string;
    controlID?: string;
    [key: string]: any;
}

export interface IDrawerData {
    title: string;
    width?: number;
    showOK?: boolean;
    showCancel?: boolean;
    okText?: string | any;
    cancelText?: string | any;
    fillContent?: boolean;
    controlSchema: IControlSchema;
    onOKTransition: { [key: string]: any };
    onCancelTransition: { [key: string]: any };
    customState: { [key: string]: any };
    onOk?: () => void;
    onCancel?: () => void;
    showCloseButton?: boolean;
    isToggleSize?: boolean;
}
export interface IShowDrawerEventArgs extends IEventArgs {
    type: string;
    title: string;
    width: string;
    showOK?: boolean;
    showCancel?: boolean;
    okText?: string | any;
    cancelText?: string | any;
    fillContent?: boolean;
    controlSchema: { [key: string]: any };
    onOKTransition: { [key: string]: any };
    onCancelTransition: { [key: string]: any };
    customState: { [key: string]: any };
}

export interface IDrawerStateProps {
    stackDrawerData: { [key: string]: any };
    stackDrawerLevel: number;
}

export interface IDrawerStateTransitionProps {
    onShowDrawer: (event: any) => void;
    onHideDrawer: () => void;
    onToggleSize: () => void;
}

/* Modal */
export interface IModalData {
    title: string,
    controlSchema: IControlSchema;
    okText?: string;
    cancelText?: string;
    onOKTransition?: { [key: string]: any };
    onCancelTransition?: { [key: string]: any };
    showOKButton?: boolean;
    showCancelButton?: boolean;
    showCloseButton?: boolean;
    customState?: { [key: string]: any };
    width?: number;
    onOk?: () => void;
    onCancel?: () => void;
}

export interface IShowModalEventArgs extends IEventArgs {
    title: string;
    controlSchema: { [key: string]: any };
    onOKTransition: { [key: string]: any };
    onCancelTransition: { [key: string]: any };
    customState: { [key: string]: any };
    width: string;
    fillContent: any;
    showOK: boolean;
    showCancel: boolean;
    okText: string;
    cancelText: string;
    onOk: any;
    onCancel: any;
    showCloseButton: boolean;
    isToggleSize?: boolean;
}

export interface IModalStateProps {
    modalData: { [key: string]: any };
    customState: { [key: string]: any };
    transition: any;
}

export interface IModalStateTransitionProps {
    onShowModal: (event: any) => void;
    onHideModal: () => void;
}

/* Popup */
declare enum PopupType {
    ALERT = 1,
    CONFIRM = 2
}
export interface IPopupData {
    popupMessage: string;
    popupType?: PopupType;
    onOk: () => void | string;
    onCancel: () => void | string;
    showCloseButton: string;
    title: string
}
export interface IShowPopupEventArgs {
    popupMessage: string;
    popupType: number;
    onOk: { [key: string]: any };
    onCancel: { [key: string]: any };
}

export interface IPopupStateProps extends IEventArgs {
    popupDetails: { [key: string]: any };
    customState: { [key: string]: any };
    transition: any;
}

export interface IPopupStateTransitionProps {
    onShowPopup: (event: any) => void;
    onHidePopup: () => void;
}