import { getDefaultRegistry, getLocaleString, IWidgetControlProps, retrieveSchema, SchemaContainer, WidgetsFactory, withReducer } from "@itsy-ui/core";
import { IToolbarStateTransitionProps, IToolbarWidgetDispatchProps, IToolbarWidgetStateProps } from "./toolbar";
import * as React from "react";
import { doExecuteCommand, doToolbarBeforeInit, doToolbarInit, doToolbarRefresh, ToolbarActions } from "./actions";
import reducer from "./reducer";
import { Text } from 'react-native';
import { getlocaleText } from "@itsy-ui/utils";

import stateJSON from "./state.json";

type ToolbarWidgetProps = IWidgetControlProps & IToolbarWidgetStateProps & IToolbarWidgetDispatchProps & IToolbarStateTransitionProps;

class ToolbarNativeWidget extends React.Component<ToolbarWidgetProps, {}> {

	componentWillMount() {
		this.initializeToolbar();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.schema.designerMetadata && nextProps.schema.designerMetadata.needRefresh) {
			this.initializeToolbar(nextProps.schema);
		}
	}

	initializeToolbar(schema = null) {
		const { data, typeId, contextParams } = this._getControlSchemaProperties();
		let { designerMetadata } = this._getControlSchemaProperties();
		designerMetadata = schema && schema.designerMetadata ? schema.designerMetadata : designerMetadata;
		if (data !== undefined) {
			this.props.transition({
				type: ToolbarActions.State.TOOLBAR_BEFORE_INIT,
				items: schema && schema.data ? schema.data : data,
				typeId: schema && schema.typeId ? schema.typeId : typeId,
				contextParams: contextParams,
				designerMetadata: designerMetadata,
			});
		}
	}

	_getControlSchemaProperties() {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(this.props.schema, definitions);
		return schema;
	}

	_doToolbarButtonExecute(name: string, currentObject: {}) {
		// transition commandexecute on click of button
		this.props.transition({
			type: ToolbarActions.State.TOOLBAR_COMMANDEXECUTE,
			name,
			currentObject,
			queryParams: this.props.schema.queryParams,
		});
	}

	generateLocaleString(data: any) {
		if (data.length > 0) {
			return data.map(t => {
				t["displayText"] = getLocaleString(t, "displayText");
				return t;
			});
		} else {
			return [];
		}
	}

	_getToolbarUIControlSchema() {
		const { typeId, align, className } = this._getControlSchemaProperties();
		const toolbarUIControlSchema = {
			name: `toolbar-ui-control-${typeId}`,
			properties: {
				"ui:widget": "toolbar_control",
				items: this.generateLocaleString(JSON.parse(JSON.stringify(this.props.items))),
				align: align,
				itemClick: this._doToolbarButtonExecute.bind(this),
				contextParams: this.props.contextParams,
				className: className
			},
		};

		return <SchemaContainer schema={toolbarUIControlSchema} />;
	}

	render() {
		if (!this.props.loaded) {
			return null;
		}
		const { items } = this.props;
		if (Array.isArray(items) && items.length > 0) {
			return this._getToolbarUIControlSchema();
		}
		return <Text>{getlocaleText("{{widget.error}}")}</Text>
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onToolbarBeforeInit: (evt) => dispatch(doToolbarBeforeInit(evt)),
		onToolbarInit: (evt) => dispatch(doToolbarInit(evt)),
		onToolbarRefresh: (evt) => dispatch(doToolbarRefresh(evt)),
		onToolbarCommandExecute: (evt) => dispatch(doExecuteCommand(evt)),
	};
};

const ItsyToolbarNativeWidget = withReducer("ToolbarWidget", reducer, mapDispatchToProps, stateJSON)(ToolbarNativeWidget);
ItsyToolbarNativeWidget.displayName = "ToolbarWidget";

WidgetsFactory.instance.registerFactory(ItsyToolbarNativeWidget);
WidgetsFactory.instance.registerControls({
	toolbar: "ToolbarWidget",
	"itsy:toolbar": "ToolbarWidget"
});

export default ItsyToolbarNativeWidget;