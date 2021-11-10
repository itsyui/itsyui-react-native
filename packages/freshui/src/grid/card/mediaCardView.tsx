import React from "react";
import {
	Image, Text, Box, Stack, Heading, Flex, Pressable
} from "native-base";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { getDefaultRegistry, IWidgetControlProps, retrieveSchema, WidgetsFactory, withReducer } from "@itsy-ui/core";
import { IMediaCardWidgetProps } from "./cardTypes";
import { isImageEncoded } from "../../utils/helpers";
import Actions from "../Actions";
type MediaCardControlProps = IWidgetControlProps & IMediaCardWidgetProps;

const MediaCard = (props) => {
	const { cardId, cardViewProps, onCardSelect, mediaSrc, primaryValue, secondaryValue, tertiaryValue, renderCell, actions, executeCommand } = props;

	const isSelected = (id) => {
		const { selectedRows, viewAttributes, rows } = cardViewProps;
		const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
		const selectedObj = selectedRows.find(row => row[primaryFieldId] === id);
		return selectedObj !== undefined;
	};

	return (
		<Pressable key={cardId} onPress={(evt) => onCardSelect(evt, cardId, { ...cardViewProps })} >
			<Box
				bg="primary.500"
				shadow={8}
				// rounded="lg"
				style={[styles.shadowProp, styles.cardAlign]}
			>
				{mediaSrc && <View >
					<Image source={{ uri: mediaSrc }}
						alt="image base" resizeMode="cover" height={200} roundedTop="md"
					/>
				</View>
				}
				<Stack space={4} p={[4, 4, 8]}>
					{primaryValue &&
						<Heading size={["md", "lg", "md"]} noOfLines={1} ellipsizeMode="tail" >
							{renderCell(primaryValue["column"], primaryValue["value"], 0, { ...props })}
						</Heading>
					}
					{tertiaryValue &&
						<Text lineHeight={[4, 2, 6]} noOfLines={[2]} ellipsizeMode="tail"  >
							{renderCell(tertiaryValue["column"], tertiaryValue["value"], 0, { ...props })}
						</Text>
					}
					{secondaryValue &&
						<Text lineHeight={[5, 5, 7]} noOfLines={[2]} ellipsizeMode="tail" >
							{renderCell(secondaryValue["column"], secondaryValue["value"], 0, { ...props })}
						</Text>
					}
					<Flex alignItems="flex-end" ><Actions id={cardId} actions={actions} executeCommand={executeCommand} {...cardViewProps} /></Flex >
				</Stack>
			</Box>
		</Pressable>
	)
}

class MediaCardView extends React.Component<MediaCardControlProps, {}> {

	_getControlSchemaProperties = (props) => {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(props.schema, definitions);
		return schema;
	}

	render() {
		const { cardId, cardViewProps, onCardSelect, mediaSrc, primaryValue, secondaryValue
			, tertiaryValue, renderCell, actions, executeCommand } = this._getControlSchemaProperties(this.props);
		return (
			<MediaCard
				cardId={cardId}
				cardViewProps={cardViewProps}
				mediaSrc={mediaSrc}
				primaryValue={primaryValue}
				secondaryValue={secondaryValue}
				tertiaryValue={tertiaryValue}
				actions={actions}
				renderCell={renderCell}
				onCardSelect={onCardSelect}
				executeCommand={executeCommand}
				{...this.props}
			/>
		);
	}
}

const styles = StyleSheet.create({
	shadowProp: {
		borderRadius: 8,
		shadowColor: '#171717',
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
	},
	cardAlign: {
		maxHeight: 310,
		maxWidth: 180,
		minHeight: 250
	}
});

const mapDispatchToProps = (dispatch) => {
	return {};
};

const MediaCardControlC = withReducer("MediaCardControl", mapDispatchToProps)(MediaCardView);
MediaCardControlC["displayName"] = "MediaCardControl";

WidgetsFactory.instance.registerFactory(MediaCardControlC);
WidgetsFactory.instance.registerControls({
	media_card_control: "MediaCardControl",
});

