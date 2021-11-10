import React from "react";
import {
	HStack, Text, Flex, Box, Pressable, View,
} from "native-base";
import { getDefaultRegistry, IWidgetControlProps, retrieveSchema, WidgetsFactory, withReducer } from "@itsy-ui/core";
import { ISimpleVerticalListWidgetProps } from "./listTypes";
import Actions from "../Actions";
import { SafeAreaView, StyleSheet } from 'react-native';

type SimpleVerticalListControlProps = IWidgetControlProps & ISimpleVerticalListWidgetProps;

const SimpleVerticalList = (props: any) => {
	const { index, listId, listViewProps, row, avatarValue, primaryValue, secondaryValue, tertiaryValue, actions, onListSelect, renderCell, executeCommand, gridStyle } = props;
	const listProps = listViewProps ? listViewProps : {};
	const isSelected = (id) => {
		const { selectedRows, viewAttributes, rows } = listProps;
		const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
		const selectedObj = selectedRows.find(srow => srow[primaryFieldId] === id);
		return selectedObj !== undefined;
	};
	const width = avatarValue ? "200px" : "300px";
	return (
		<Box
			paddingBottom={1}
		>
			<Pressable
				onPress={(evt) => onListSelect(evt, listId, { ...listProps })}
				alignItems='center'
				bg="white"
				border={1}
				justifyContent='center'
				height={60}
				underlayColor={'#AAA'}
				_pressed={{
					bg: 'trueGray.200'
				}}
				style={{
					borderColor: "#e5e5e5",
				}}
			>
				<HStack width="100%" px={4}>
					<HStack space={8} alignItems="center" display="flex">
						{avatarValue &&
							<View>{renderCell(avatarValue.column, row, "avatar", listProps, primaryValue)}</View>
						}
						{primaryValue &&
							<View width={width}>
								<Text numberOfLines={1} ellipsizeMode="tail" fontSize="16px" >
									{renderCell(primaryValue.column, row, "primary", listProps)}
								</Text>
								{secondaryValue &&
									<Text numberOfLines={1} ellipsizeMode="tail" fontSize="12px">
										{renderCell(secondaryValue.column, row, "secondary", listProps)}
									</Text>
								}
							</View>
						}
						<View alignItems="flex-end" flexDirection="row" display="flex" >
							<Actions id={listId} actions={actions} executeCommand={executeCommand} {...listProps} />
						</View>
					</HStack>
				</HStack>
			</Pressable>
		</Box>
	)
}

class SimpleVerticalListView extends React.Component<SimpleVerticalListControlProps, {}> {

	_getControlSchemaProperties = (props: any) => {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(props.schema, definitions);
		return schema;
	}

	render() {
		const { index, listId, listViewProps, row, primaryValue, secondaryValue, tertiaryValue, avatarValue, actions, onListSelect, renderCell, executeCommand, gridStyle } = this._getControlSchemaProperties(this.props);
		return (
			<SimpleVerticalList
				index={index}
				gridStyle={gridStyle}
				listId={listId}
				listViewProps={listViewProps}
				row={row}
				primaryValue={primaryValue}
				secondaryValue={secondaryValue}
				tertiaryValue={tertiaryValue}
				avatarValue={avatarValue}
				actions={actions}
				renderCell={renderCell}
				onListSelect={onListSelect}
				executeCommand={executeCommand}
				{...this.props}
			/>
		);
	}
}

const mapDispatchToProps = () => {
	return {};
};

const SimpleVerticalListControlC = withReducer("SimpleVerticalListControl", mapDispatchToProps)(SimpleVerticalListView);
SimpleVerticalListControlC["displayName"] = "SimpleVerticalListControl";

WidgetsFactory.instance.registerFactory(SimpleVerticalListControlC);
WidgetsFactory.instance.registerControls({
	simple_vertical_list_control: "SimpleVerticalListControl",
});
