import React from "react";
import {
	Text, Box, Stack, Heading, Flex
} from "native-base";
import { TouchableOpacity, StyleSheet } from 'react-native';
import { getDefaultRegistry, IWidgetControlProps, retrieveSchema, WidgetsFactory, withReducer } from "@itsy-ui/core";
import { ISimpleCardWidgetProps } from "./cardTypes";
import { isImageEncoded } from "../../utils/helpers";
import Actions from "../Actions";

type ISimpleCard = IWidgetControlProps & ISimpleCardWidgetProps;

const SimpleCard = (props) => {
	const { cardId, cardViewProps, onCardSelect, primaryValue, secondaryValue, tertiaryValue, renderCell, actions, executeCommand } = props;

	const isSelected = (id) => {
		const { selectedRows, viewAttributes, rows } = cardViewProps;
		const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
		const selectedObj = selectedRows.find(row => row[primaryFieldId] === id);
		return selectedObj !== undefined;
	};

	return (
		<TouchableOpacity key={cardId} onPress={(evt) => onCardSelect(evt, cardId, { ...cardViewProps })} >
			<Box
				bg="white"
				shadow={8}
				rounded="lg"
				border="0.5px solid darkgray"
				style={styles.cardAlign}
			>

				<Stack space={4} p={[4, 4, 8]}>
					{primaryValue &&
						<Heading size={["md", "lg", "md"]} noOfLines={1}>
							{renderCell(primaryValue["column"], primaryValue["value"], 0, { ...props })}
						</Heading>
					}
					{tertiaryValue &&
						<Text lineHeight={[4, 2, 6]} noOfLines={[4, 4, 2]} >
							{renderCell(tertiaryValue["column"], tertiaryValue["value"], 0, { ...props })}
						</Text>
					}
					{secondaryValue &&
						<Text lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
							{renderCell(secondaryValue["column"], secondaryValue["value"], 0, { ...props })}
						</Text>
					}
					<Flex alignItems="flex-end" ><Actions id={cardId} actions={actions} executeCommand={executeCommand} {...cardViewProps} /></Flex>
				</Stack>
			</Box>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	cardAlign: {
		maxHeight: 310,
		maxWidth: 180,
		minHeight: 150
	}
});

class SimpleCardControl extends React.Component<ISimpleCard, {}> {

	_getControlSchemaProperties = (props) => {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(props.schema, definitions);
		return schema;
	}

	render() {
		const { cardId, cardViewProps, onCardSelect, primaryValue, secondaryValue, renderCell, actions, executeCommand } = this._getControlSchemaProperties(this.props);
		return (
			<SimpleCard
				cardId={cardId}
				cardViewProps={cardViewProps}
				primaryValue={primaryValue}
				secondaryValue={secondaryValue}
				actions={actions}
				renderCell={renderCell}
				onCardSelect={onCardSelect}
				executeCommand={executeCommand}
				{...this.props}
			/>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {};
};

const SimpleCardControlC = withReducer("SimpleCardControl", mapDispatchToProps)(SimpleCardControl);
SimpleCardControlC["displayName"] = "SimpleCardControl";

WidgetsFactory.instance.registerFactory(SimpleCardControlC);
WidgetsFactory.instance.registerControls({
	simple_card_control: "SimpleCardControl",
	"itsy:ui:simplecard": "SimpleCardControl",
});
