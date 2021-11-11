import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { Container, NativeBaseProvider } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const LayoutControl = (props: any) => {
	const { regions, themeView, layoutType, className, style } = _getControlSchemaProperties(props);

	return <NativeBaseProvider>
		{props.children}
	</NativeBaseProvider>

}

LayoutControl["displayName"] = 'LayoutWidget';
WidgetsFactory.instance.registerFactory(LayoutControl);
WidgetsFactory.instance.registerControls({
	layout: 'LayoutWidget',
	"itsy:ui:layout": 'LayoutWidget'
});