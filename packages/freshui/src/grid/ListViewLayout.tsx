import React from 'react';
import { getDefaultRegistry, IWidgetControlProps, retrieveSchema, SchemaContainer } from "@itsy-ui/core";
import { IComplexInteractionListWidgetProps, IListTypes, IListValue, ISimpleHorizontalListWidgetProps, ISimpleVerticalListWidgetProps } from "./Lists/listTypes";
import { getDate, getFileName, isImageBase64Content } from "../utils/helpers";
import { DateTimeMode } from "../utils/constants"
import { Avatar, Image, List, VStack, Divider, View } from 'native-base';
import { SafeAreaView, StyleSheet } from 'react-native';

import "./list/simpleVerticalListView";

interface IListViewLayoutProps {
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
type ListViewUIControlProps = IWidgetControlProps & IListViewLayoutProps;

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

function renderCell(column: any, row: any, listAttr: string, props: any, primaryValue?: any) {
	const { renderCustomCellFields } = props;
	if (column.type === "image" || listAttr === "avatar") {
		const avatarImageSrc = Array.isArray(row[column.name]) && row[column.name].length > 0 ? row[column.name][0] : row[column.name];
		const fileName = getFileName(avatarImageSrc);
		const isImageSrc = isImageBase64Content(fileName);
		return (
			<>
				{
					avatarImageSrc ?
						<Avatar
							source={{ uri: avatarImageSrc }}
							alt="image base"
						/>
						:
						<Avatar >
							{primaryValue && typeof (primaryValue.value) === "string" ? primaryValue.value.substr(0, 2) : ""}
						</Avatar>
				}
			</>
		);
	} else if (column.type === DateTimeMode.DATE_TIME) {
		const displayType = column.fieldSchema && column.fieldSchema.displayType ? column.fieldSchema.displayType : DateTimeMode.DATE;
		const dateValue = getDate(row[column.name], displayType);
		return (
			<>{dateValue}</>
		);
	} else if (column.type === "widget") {
		return renderCustomCellFields && renderCustomCellFields(column, null, row);
	} else if (column.type === "boolean") {
		const boolValue = row && row[column.name] !== undefined ? `${row[column.name]}` : `false`;    //if user didn't toggle switch & submit
		return <>{`${boolValue}`}</>;
	} else {
		const fieldSchema = column.fieldSchema ? column.fieldSchema : {};
		const { displayKey, fieldType, mappedTypeId } = fieldSchema;
		const typeData = row[mappedTypeId];
		let columnValue = "";
		if (typeData && fieldType === "mapped" && Array.isArray(displayKey)) {
			columnValue = displayKey.reduce((colValue, key) => {
				return Array.isArray(typeData) && typeData.length > 0 ? typeData[0][key] ? colValue === "" ? `${typeData[0][key]}` : `${colValue},${typeData[0][key]}` : colValue
					: typeData[key] ? colValue === "" ? `${typeData[key]}` : `${colValue}, ${typeData[key]}` : colValue
			}, "");
		} else {
			columnValue = Array.isArray(row[column.name]) ? row[column.name].join(", ") : row[column.name];
		}
		return columnValue;
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
		return {
			"column": column,
			"value": row[column.name],
		};
	}
	return null;
}

function executeCommand(action: any, id: string, props: any, event: any) {
	const { rows, commandExecute, viewAttributes } = props;
	const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
	const selectedRecord = rows.find(rec => rec[primaryFieldId] === id);
	commandExecute(action, selectedRecord, event);
}

const getListUIControlSchema = (index: any, listType: string, id: string, props: any, row: any, primaryValue: IListValue, secondaryValue: IListValue, tertiaryValue: IListValue, avatarValue?: IListValue, actions?: any[], additionalColumns?: any[], gridStyle: string) => {
	let listUIControlSchema;
	const simpleVerticalListControlProps: ISimpleVerticalListWidgetProps = {
		listId: id,
		listViewProps: { ...props },
		gridStyle,
		row: row,
		primaryValue: primaryValue,
		secondaryValue: secondaryValue,
		avatarValue: avatarValue,
		actions: actions,
		index: index,
		onListSelect: onRowSelect,
		renderCell: renderCell,
		executeCommand: executeCommand,
	};
	listUIControlSchema = {
		name: listType,
		properties: {
			"ui:widget": "simple_vertical_list_control",
			"listType": listType,
			...simpleVerticalListControlProps,
		},
	};
	return listUIControlSchema;
};

const ListView = (props: any) => {
	const { rows, columns, viewAttributes, currentPage, pageInfo, paginationChange, handleScroll, className, style } = props;
	const { getActions } = props.schema;
	const listAttributes = viewAttributes && viewAttributes.attributes && Object.keys(viewAttributes.attributes).length > 0 ? viewAttributes.attributes : {
		"primary": columns && columns.length > 0 ? columns[0].name : null,
		"secondary": columns && columns.length > 1 ? columns[1].name : null,
		"tertiary": columns && columns.length > 2 ? columns[2].name : null,
	};
	const page = currentPage - 1;
	const listType = viewAttributes && viewAttributes.listType ? viewAttributes.listType : listAttributes.listType;
	const gridStyle = viewAttributes.gridStyle;
	const isIncrementalAdd = viewAttributes && viewAttributes.attributes && viewAttributes.attributes.incrementalAdd !== undefined ? viewAttributes.attributes.incrementalAdd : false;
	const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(rows[0])[0];
	const customStyle = style ? style : {};
	// if (listType === "swipeableList") {
	// 	return <SchemaContainer schema={{
	// 		name: "swipeAbleList",
	// 		properties: {
	// 			"ui:widget": "swipeAble_List",
	// 			...props,
	// 			onListSelect: onRowSelect,
	// 			getActions: getActions,
	// 		}
	// 	}} />
	// }
	return (
		<View style={customStyle} width={"100%"}>
			<List border={0}>
				{rows.map((row, index) => {
					const id = row[primaryFieldId];
					const primaryValue = getValue(row, columns, listAttributes.primary);
					const secondaryValue = getValue(row, columns, listAttributes.secondary);
					const tertiaryValue = getValue(row, columns, listAttributes.tertiary);
					const avatarValue = getValue(row, columns, listAttributes.avatar);
					const actions = getActions(row);
					const listUIControlSchema = getListUIControlSchema(index, listType, id, props, row, primaryValue, secondaryValue, tertiaryValue, avatarValue, actions, listAttributes.additionalColumns, gridStyle);
					return <SchemaContainer key={index} schema={listUIControlSchema} />;
				})}
			</List>
		</View>
	)
}

class ListViewLayout extends React.Component<ListViewUIControlProps, {}> {

	_getControlSchemaProperties = (props: any) => {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(props.schema, definitions);
		return schema;
	}

	commandExecute(action: any, rows: any, evt: any) {
		const { customButtonClick } = this.props;
		customButtonClick(action, rows);
	}

	render() {
		const { viewAttributes, renderCustomCell, renderCustomCellFields, rowSelectionMode, className, style } = this._getControlSchemaProperties(this.props);
		return (
			<ListView
				viewAttributes={viewAttributes}
				renderCustomCell={renderCustomCell}
				rowSelectionMode={rowSelectionMode}
				renderCustomCellFields={renderCustomCellFields}
				commandExecute={this.commandExecute.bind(this)}
				{...this.props}
				style={style}
			/>
		);
	}
}

export default ListViewLayout;
