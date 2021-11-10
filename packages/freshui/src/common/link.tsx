import React, { useEffect, useRef } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";
import { Link } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const LinkControl = (props: any) => {
	const schema = _getControlSchemaProperties(props);
	const {
		url,
		label,
		className,
		style
	} = schema;
	const customClass = className ? className : "";
	const customStyle = style ? { ...style } : {};
	return (
		<Link href={url} isExternal style={customStyle}>{label}</Link>
	);
}


LinkControl["displayName"] = "LinkUIControl";

WidgetsFactory.instance.registerFactory(LinkControl);
WidgetsFactory.instance.registerControls({
    "itsy:ui:link": "LinkUIControl",
});
