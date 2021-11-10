import React from 'react';
import { getDefaultRegistry, useTransition, retrieveSchema, WidgetsFactory, withReducer, DataLoaderFactory, ICommandManager } from "@itsy-ui/core";
import { Button, View } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const initialState = {};

function reducer(state, action) {
	switch (action.type) {
		default:
			return state === undefined ? initialState :
				Object.keys(state).length === 0 ? initialState : state;
	}
}

const stateJSON = {
	"initial": "onLoaded",
	"states": {
		"onLoaded": {
			"on": {

			},
		},
	},
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

const isFunction = (functionToCheck: any) => {
	return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
};

class CommandBtn extends React.Component {

	getCommandContext = (onContext: any) => {
		if (onContext && isFunction(onContext)) {
			return onContext.call(null)
		} else if (onContext) {
			return onContext;
		}
		return {};
	}

	handleClick = async (evt: any, onContext: any) => {
		const { commandName, onClick } = _getControlSchemaProperties(this.props);
		if (commandName) {
			const dataLoader = WidgetsFactory.instance.services["DataLoaderFactory"] as DataLoaderFactory;
			const commandManager = dataLoader.getLoader<ICommandManager>("commandManager");
			const cmd = commandManager.getCommand(commandName, {});
			try {
				const context = this.getCommandContext(onContext);
				await cmd!.execute(context, this.props.transition);
			} catch (e) {
				console.log("Command execution error: ", e);
				throw e;
			}
		} else if (onClick) {
			onClick(evt);
		}
	}

	render() {
		const { title, style, alignText, iconPosition, iconName, onContext, className } = _getControlSchemaProperties(this.props);
		const alignstyle = alignText !== undefined && alignText === "right" ? "flex-end" : alignText === "center" ? "center" : "flex-start";
		const customStyle = style ? style : {};
		return (
			<View style={{ "justifyContent": alignstyle, ...style }}>
				<Button colorScheme="primary"
					startIcon={iconPosition === "startIcon" ? <Icon style={{
						fontSize: 25,
						height: 22,
						color: 'white',
					}}
						name={iconName} /> : ""}
					endIcon={iconPosition === "endIcon" ? <Icon
						style={{
							fontSize: 25,
							height: 22,
							color: 'white',
						}}
						name={iconName} /> : ""}
					onPress={(evt) => this.handleClick(evt, onContext)}
				>
					{title}
					{this.props.children && this.props.children}
				</Button>
			</View>
		)
	}
}

const C = withReducer("commandButton", mapDispatchToProps)(CommandBtn);
C["displayName"] = "commandButton";

WidgetsFactory.instance.registerFactory(C);
WidgetsFactory.instance.registerControls({
	itsy_button_ui: "commandButton",
});