import React, { useState } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { HStack } from 'native-base';
import { StyleSheet, View } from "react-native";
import { getJustifyContent, getAlignItems } from "../utils/helpers";

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const RowControl = (props: any) => {
	const { className, children, span, hAlignment, vAlignment, schema } = _getControlSchemaProperties(props);
	let { padding, style } = _getControlSchemaProperties(props)
	const justifyContent = getJustifyContent(hAlignment, schema)
	const alignItems = getAlignItems(vAlignment, schema)
	style = style ? style : schema && schema.style ? schema.style : null;
	const customStyle = style ? style : {};
	return (
		<View style={{ ...styles.container, padding, ...customStyle, justifyContent, alignItems, }}>
			{props.children ? props.children : children}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap"
	},
});


RowControl["displayName"] = 'Row';

WidgetsFactory.instance.registerFactory(RowControl);
WidgetsFactory.instance.registerControls({
	row_control: 'Row',
	'itsy:ui:row': 'Row'
});