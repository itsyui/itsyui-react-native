import React, { useEffect } from 'react';
import { useToast } from 'native-base';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";


const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const ToastNotification = (props: any) => {
	const { action, message, visibility, metadata, onClose, handleAction, className, style } = _getControlSchemaProperties(props);
	const toast = useToast()

	useEffect(() => {
		const { text, type, description } = message;
		const { delay } = metadata;
		if (visibility) {
			toast.show({
				title: text,
				...type && { status: type },
				...delay && { duration: delay },
				...description && { description: description },
				onCloseComplete: () => {
					onClose();
				}
			});
		}
	}, [visibility]);

	return null;
}

ToastNotification.displayName = "ToastNotification";
WidgetsFactory.instance.registerFactory(ToastNotification);
WidgetsFactory.instance.registerControls({
	notification_popup_ui: "ToastNotification",
	'itsy:ui:notification': "ToastNotification"
});