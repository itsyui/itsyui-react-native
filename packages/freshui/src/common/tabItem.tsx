import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, SchemaContainer } from "@itsy-ui/core";
import { ScrollView } from 'react-native';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};


const TabItemUIControl = (props: any) => {
	const { activeItem, data } = _getControlSchemaProperties(props);
	return (
		<ScrollView>
			<SchemaContainer schema={data.content} />
		</ScrollView>
	);
}

TabItemUIControl["displayName"] = "TabItemUIControl";

WidgetsFactory.instance.registerFactory(TabItemUIControl);
WidgetsFactory.instance.registerControls({
	tab_item_control: "TabItemUIControl",
	"itsy:ui:tabitem": "TabItemUIControl"
});
