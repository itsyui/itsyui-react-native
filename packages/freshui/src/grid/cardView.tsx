
import React from 'react';
import { getDefaultRegistry, IWidgetControlProps, retrieveSchema, SchemaContainer } from "@itsy-ui/core";
import { IAvatarCardWidgetProps, ICardTypes, ICardValue, IComplexInteractionCardWidgetProps, IHorizontalCardWidgetProps, IMediaCardWidgetProps, ISimpleCardWidgetProps } from "./card/cardTypes";
import { getDate } from "../utils/helpers";
import { DateTimeMode } from "../utils/constants"
import { View, StyleSheet, SafeAreaView } from "react-native"

import "./card/simpleCardView";
import "./card/mediaCardView";

interface ICardViewLayoutProps {
	columns: any[];
	rows: any[];
	rowSelection: any;
	viewType: any;
	viewAttributes: any;
	selectedRows: any[];
	customButtonClick: any;
	onGridSelectedRows: any;
	paginationChange: any;
	currentPage: any;
	pageInfo: any;
}

type CardViewUIControlProps = IWidgetControlProps & ICardViewLayoutProps;

function renderCell(col: any, cellValue: any, idx: any, props: any) {
	const { renderCustomCell, renderCustomCellFields } = props;
	if (col.type === "datetime") {
		const displayType = col.fieldSchema && col.fieldSchema.displayType ? col.fieldSchema.displayType : DateTimeMode.DATE;
		const dateValue = getDate(cellValue, displayType);
		return dateValue;
	} else if (col.type === "custom") {
		return renderCustomCell && renderCustomCell(col, cellValue, idx);
	} else if (col.type === "widget") {
		return renderCustomCellFields && renderCustomCellFields(col, cellValue, idx);
	} else if (col.type === "image") {
		return null;
	} else if (col.type === "boolean") {
		const boolValue = cellValue && cellValue[col.name] !== undefined ? `${cellValue[col.name]}` : `false`;    //if user didn't toggle switch & submit
		return boolValue;
	}
	return cellValue;
}

function onRowSelect(event: any, id: string, props: any) {
	const { selectedRows, rows, onGridSelectedRows, rowSelectionMode, viewAttributes } = props;
	const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
	const selectedRecord = rows.filter(rec => rec[primaryFieldId] === id);
	let newSelected: string[] = [];
	if (rowSelectionMode === 2) {
		const isAlreadySelected = selectedRows.find(rec => rec[primaryFieldId] === id);
		if (!isAlreadySelected) {
			newSelected = newSelected.concat(selectedRows, selectedRecord);
		} else {
			if (selectedRows.length === 1) {
				newSelected = newSelected.concat(selectedRows.slice(1));
			} else {
				const index = selectedRows.findIndex(rec => rec[primaryFieldId] === id);
				newSelected = newSelected.concat(selectedRows.slice(0, index), selectedRows.slice(index + 1));
			}
		}
		onGridSelectedRows(newSelected);
	} else if (rowSelectionMode === 1) {
		onGridSelectedRows(selectedRecord);
	}
}

function getColumn(columnName: string, columns: any) {
	if (columns && columns.length > 0 && columnName) {
		const filteredColumns = columns.filter(col => col.name === columnName);
		return filteredColumns && filteredColumns.length > 0 ? filteredColumns[0] : null;
	}
	return null;
}

function getValue(row: any, columns: any, columnName: string) {
	const column = getColumn(columnName, columns);
	if (column && row) {
		const columnValue = { column: column, value: "" };
		const fieldSchema = column.fieldSchema ? column.fieldSchema : {};
		const { displayKey, fieldType, mappedTypeId } = fieldSchema;
		const typeData = row[mappedTypeId];
		if (typeData && fieldType === "mapped" && Array.isArray(displayKey)) {
			columnValue.value = displayKey.reduce((colValue, key) => {
				return Array.isArray(typeData) && typeData.length > 0 ? typeData[0][key] ? colValue === "" ? `${typeData[0][key]}` : `${colValue},${typeData[0][key]}` : colValue
					: typeData[key] ? colValue === "" ? `${typeData[key]}` : `${colValue}, ${typeData[key]}` : colValue
			}, "");
		} else {
			columnValue.value = Array.isArray(row[column.name]) ? row[column.name].join(", ") : row[column.name];
		}
		return columnValue;
	}
	return null;
}

function executeCommand(action: any, id: string, props: any, event: any) {
	const { rows, commandExecute, viewAttributes } = props;
	const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
	const selectedRecord = rows.find(rec => rec[primaryFieldId] === id);
	commandExecute(action, selectedRecord, event);
}


const CardView = (props) => {

	const { rows, columns, currentPage, viewAttributes, pageInfo, paginationChange, className, style } = props;
	const { getActions } = props.schema;
	const cardAttributes = viewAttributes && viewAttributes.attributes && Object.keys(viewAttributes.attributes).length > 0 ? viewAttributes.attributes : {
		"primary": columns && columns.length > 0 ? columns[0].name : null,
		"secondary": columns && columns.length > 1 ? columns[1].name : null,
		"tertiary": columns && columns.length > 2 ? columns[2].name : null,
	};
	const page = currentPage - 1;
	const cardType = viewAttributes && viewAttributes.cardType ? viewAttributes.cardType : cardAttributes.cardType;
	const gridItemLg = cardType === ICardTypes.horizontal ? 4 : 3;
	const isIncrementalAdd = viewAttributes && viewAttributes.attributes && viewAttributes.attributes.incrementalAdd !== undefined ? viewAttributes.attributes.incrementalAdd : false;
	const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
	const customClass = className ? className : "";

	return (
		<View style={[styles.card, { ...style }]}>
			{rows && Array.isArray(rows) && rows.map((row, i) => {
				const id = row[primaryFieldId];
				const primaryValue = getValue(row, columns, cardAttributes.primary);
				const secondaryValue = getValue(row, columns, cardAttributes.secondary);
				const tertiaryValue = getValue(row, columns, cardAttributes.tertiary);
				const avatarSrc = getValue(row, columns, cardAttributes.avatar);
				const mediaSrc = getValue(row, columns, cardAttributes.media);
				const actions = getActions(row);
				const cardUIControlSchema = getCardUIControlSchema(cardType, id, props, avatarSrc, primaryValue, secondaryValue, tertiaryValue, actions, mediaSrc, row);
				return (<View style={styles.cardContainer}>
					<SchemaContainer key={"grid_item_" + i} schema={cardUIControlSchema} />
				</View>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap"
	},
	cardContainer: {
		minWidth: "50%",
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
});


const getCardUIControlSchema = (cardType: string, id: string, props: any, avatarSrc: any, primaryValue: ICardValue, secondaryValue: ICardValue, tertiaryValue: ICardValue, actions: any, mediaSrc: any, row: any) => {
	let cardUIControlSchema;
	if (cardType === ICardTypes.simple) {
		const simpleCardControlProps: ISimpleCardWidgetProps = {
			cardId: id,
			cardViewProps: { ...props },
			primaryValue: primaryValue,
			secondaryValue: secondaryValue,
			actions: actions,
			onCardSelect: onRowSelect,
			renderCell: renderCell,
			executeCommand: executeCommand,
		};
		cardUIControlSchema = {
			name: cardType,
			properties: {
				"ui:widget": "simple_card_control",
				"cardType": cardType,
				...simpleCardControlProps,
			},
		};
	} else if (cardType === ICardTypes.media) {
		const mediaCardControlProps: IMediaCardWidgetProps = {
			cardId: id,
			cardViewProps: { ...props },
			mediaSrc: mediaSrc && mediaSrc.value,
			primaryValue: primaryValue,
			secondaryValue: secondaryValue,
			tertiaryValue: tertiaryValue,
			actions: actions,
			onCardSelect: onRowSelect,
			renderCell: renderCell,
			executeCommand: executeCommand,
		};
		cardUIControlSchema = {
			name: cardType,
			properties: {
				"ui:widget": "media_card_control",
				"cardType": cardType,
				...mediaCardControlProps,
			},
		};
	}
	return cardUIControlSchema;
};

class CardViewLayout extends React.Component<CardViewUIControlProps, {}>{

	_getControlSchemaProperties = (props) => {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(props.schema, definitions);
		return schema;
	}

	commandExecute = (action: any, rows: any, evt: any) => {
		const { customButtonClick } = this.props;
		customButtonClick(action, rows);
	}

	render() {
		const { viewAttributes, renderCustomCell, renderCustomCellFields, rowSelectionMode, className, style } = this._getControlSchemaProperties(this.props);
		return (
			<CardView
				viewAttributes={viewAttributes}
				renderCustomCell={renderCustomCell}
				renderCustomCellFields={renderCustomCellFields}
				rowSelectionMode={rowSelectionMode}
				commandExecute={this.commandExecute.bind(this)}
				{...this.props}
				className={className}
				style={style}
			/>
		)
	}
}

export default CardViewLayout;