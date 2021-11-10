import React, { useState } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { VStack } from 'native-base';
import { StyleSheet, View } from "react-native";
import { getJustifyContent, getAlignItems } from "../utils/helpers";

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const ColumnControl = (props: any) => {
	const { hAlignment, vAlignment, schema } = _getControlSchemaProperties(props);
	let { padding, style } = _getControlSchemaProperties(props)

	const justifyContent = getJustifyContent(hAlignment, schema, style)
	const alignItems = getAlignItems(vAlignment, schema, style)
	padding = padding ? padding : schema && schema.padding ? schema.padding : null;
	style = style ? style : schema && schema.style ? schema.style : null;
	const customStyle = style ? style : {};

	return <View style={{ ...styles.container, ...customStyle, justifyContent, alignItems, padding }}>
		{props.schema.children ? props.schema.children : props.children}
	</View>
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});


ColumnControl["displayName"] = 'column';

WidgetsFactory.instance.registerFactory(ColumnControl);
WidgetsFactory.instance.registerControls({
	col_control: 'column',
	'itsy:ui:column': 'column'
});