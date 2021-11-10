import React from 'react';
import { WidgetsFactory, getDefaultRegistry, IWidgetControlProps, retrieveSchema, SchemaContainer } from "@itsy-ui/core";
import CardViewLayout from "./cardView";
import ListViewLayout from "./ListViewLayout";
import { Text } from "react-native"

class GridControl extends React.Component {

	_getControlSchemaProperties() {
		const registry = getDefaultRegistry();
		const { definitions } = registry;
		const schema = retrieveSchema(this.props.schema, definitions);
		return schema;
	}

	onRowSelect(event: React.MouseEvent<unknown>, id: string) {
		const { onGridSelectedRows, selectedRows, data, rowSelectionMode, viewAttributes } = this._getControlSchemaProperties();
		const primaryFieldId = viewAttributes && viewAttributes.primaryColumn ? viewAttributes.primaryColumn : Object.keys(data.records[0])[0];
		const selectedRecord = data.records.filter(rec => rec[primaryFieldId] === id);
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

	getColumns(data: any) {
		const { viewAttributes } = this._getControlSchemaProperties();
		const transformedColumns = data && Array.isArray(data.columns) ? [].concat.apply([], data.columns.filter(col => !col.isHidden)) : [];
		if (viewAttributes && viewAttributes.customAction && viewAttributes.customAction.actions.length > 0) {
			const customAction = viewAttributes.customAction;
			transformedColumns.push({
				name: customAction.title,
				label: customAction.title,
				type: "customAction",
			});
		}
		return transformedColumns;
	}

	render() {
		const { data, selectedRows, viewAttributes, currentPage, pageInfo, onGridSelectedRows, customButtonClick, paginationChange, sortingInfo, className, style } = this._getControlSchemaProperties();
		const { viewType, gridStyle, customGridViewId, emptyRecordsMessage, attributes } = viewAttributes;
		const rowSelection = {
			selectedRowKeys: selectedRows && selectedRows.length > 0 ? selectedRows.map(t => data.records.indexOf(t)) : [],
			onChange: this.onRowSelect.bind(this),
		};
		//Grid related settings
		const selected = selectedRows;
		const page = currentPage - 1;
		const columns = this.getColumns(data);

		if (!data || (Array.isArray(columns) && columns.length === 0) || !Array.isArray(data.records) || data.records.length === 0) {
			return <Text style={{ padding: 5, fontSize: 20 }}>{emptyRecordsMessage ? emptyRecordsMessage : "No Records"}</Text>;
		}

		if (viewType === "card") {
			return <CardViewLayout
				columns={columns}
				rows={data.records}
				rowSelection={rowSelection}
				viewType={viewType}
				viewAttributes={viewAttributes}
				selectedRows={selectedRows}
				customButtonClick={customButtonClick}
				onGridSelectedRows={onGridSelectedRows}
				paginationChange={paginationChange}
				currentPage={currentPage}
				pageInfo={pageInfo}
				schema={this.props.schema}
				{...this.props}
			/>

		} else if (viewType === "custom" && customGridViewId) {
			const controlProps = this._getControlSchemaProperties();
			const customViewControlSchema = {
				name: viewType,
				properties: {
					...this.props,
					...controlProps,
					"ui:widget": customGridViewId,
					viewType,
				},
			};
			return <SchemaContainer schema={customViewControlSchema} />;
		}
		return <ListViewLayout
			columns={columns}
			rows={data.records}
			rowSelection={rowSelection}
			viewType={viewType}
			viewAttributes={viewAttributes}
			selectedRows={selectedRows}
			customButtonClick={customButtonClick}
			onGridSelectedRows={onGridSelectedRows}
			paginationChange={paginationChange}
			currentPage={currentPage}
			pageInfo={pageInfo}
			schema={this.props.schema}
			{...this.props}
		/>
	}
}

GridControl['displayName'] = 'GridControl';

WidgetsFactory.instance.registerFactory(GridControl);
WidgetsFactory.instance.registerControls({
	grid_control: "GridControl",
});

