import React, { useState } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { Container, Box } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const ContainerControl = (props: any) => {
	const { children, padding, schema } = _getControlSchemaProperties(props);
	// const p = padding ? padding : 5;
	let { style } = _getControlSchemaProperties(props)
	style = style ? style : schema && schema.style ? schema.style : null;

	return (
		<Box style={{ display: "flex", ...style }} >
			{props.children ? props.children : children}
		</Box>
	)
}


ContainerControl["displayName"] = 'content';

WidgetsFactory.instance.registerFactory(ContainerControl);
WidgetsFactory.instance.registerControls({
	content_control: 'content',
	'itsy:ui:content': 'content'
});