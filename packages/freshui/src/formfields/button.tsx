import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { Button, Icon } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const ButtonControl = (props: any) => {
	const { text, icon, fieldSchema, displayName, style, className } = _getControlSchemaProperties(props);

	const handleClick = () => {
		const { onButtonClick, fieldSchema } = _getControlSchemaProperties(props);
		if (onButtonClick && typeof onButtonClick === "function") {
			onButtonClick();
		} else {
			fieldSchema.onButtonClick();
		}
	}

	return <>
		{icon ?
			<Icon style={style} onPress={() => handleClick()}>
				{icon}
			</Icon>
			:
			<Button style={style} onPress={() => handleClick()} >
				{displayName ? displayName : fieldSchema && fieldSchema.displayName}
				{props.children && props.children}
			</Button>
		}
	</>
}

ButtonControl["displayName"] = "ButtonControl";

WidgetsFactory.instance.registerFactory(ButtonControl);
WidgetsFactory.instance.registerControls({
	button_control: 'ButtonControl',
	"itsy:ui:button": 'ButtonControl'
});