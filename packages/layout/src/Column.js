import { SchemaContainer, WidgetsFactory } from "@itsy-ui/core";
import React, { Component } from "react";

class ItsyColumn extends Component {

	render() {
		const ItsyColumnSchema = {
			name: "col_control",
			properties: {
				"ui:widget": "col_control",
				...this.props
			}
		};
		return <SchemaContainer schema={ItsyColumnSchema} />;
	}
}
ItsyColumn["displayName"] = "ItsyColumn";

ItsyColumn["displayName"] = "ItsyColumn";
WidgetsFactory.instance.registerFactory(ItsyColumn);
WidgetsFactory.instance.registerControls({
	itsy_contianer: "ItsyColumn",
	'itsy:column': "ItsyColumn"
});

export default ItsyColumn;