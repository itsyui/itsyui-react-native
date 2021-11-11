import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import { Flex, FormControl, Text } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const LabelControl = (props: any) => {
	const { title, headerTag, headerSize, style, className, alignText } = _getControlSchemaProperties(props);
	const CustomTag = headerTag ? headerTag : headerSize;
	const alignStyle = alignText !== undefined && alignText === "right" ? "flex-end" : alignText === "center" ? "center" : "flex-start";

	return <Flex alignItems={alignStyle}>
		<Text style={style} >{title}</Text >
	</Flex>
}

LabelControl["displayName"] = "LabelControl";

WidgetsFactory.instance.registerFactory(LabelControl);
WidgetsFactory.instance.registerControls({
	label_control: "LabelControl",
	"itsy:form:label": "LabelControl"
});
