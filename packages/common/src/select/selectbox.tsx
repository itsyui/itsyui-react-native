import { getDefaultRegistry, retrieveSchema, SchemaContainer, WidgetsFactory, withReducer } from "@itsy-ui/core";
import * as React from "react";
import { getUpdatedFilter } from "../utils";

const initialState = {
    selectOptions: [],
    selectedValue: null,
};

const Actions = {
    LoadOptions: "Selectbox.LoadOptions",
    UpdateSelectValue: "Selectbox.UpdateSelectValue",
};

function reducer(state, action) {
    switch (action.type) {
        case Actions.LoadOptions:
            return {
                ...state,
                selectOptions: action.options,
                selectedValue: action.defaultValue,
            };
        case Actions.UpdateSelectValue:
            return {
                ...state,
                selectedValue: action.value,
            };
        default:
            return state === undefined ? initialState :
                Object.keys(state).length === 0 ? initialState : state;
    }
}

function updateOptions(options, defaultValue) {
    return {
        type: Actions.LoadOptions,
        options,
        defaultValue,
    };
}

function updateSelectValue(value) {
    return {
        type: Actions.UpdateSelectValue,
        value,
    };
}

export function doLoadOptions(controlProps) {
    return async (_getState, dispatch, transition) => {
        const { fieldSchema, handleChange, value, queryParams } = controlProps;
        const { options, datasource, metadata, defaultValue } = fieldSchema;
        let selectOptions = [];
        if (metadata && metadata.typeId) {
            const { typeId, valueKey, displayKey } = metadata;
            const dataLoader = WidgetsFactory.instance.services["DataLoaderFactory"];
            let schemaDatasource = datasource ? (datasource.getAll ? datasource : dataLoader.getLoader(datasource)) : dataLoader.getLoader("datasource");
            if (schemaDatasource) {
                const parameters = {
                    propertyDefinitions: [valueKey, ...(Array.isArray(displayKey) ? displayKey : [])].reduce((propDefs, key) => { return { ...propDefs, ...{ [key]: {} } } }, {}),
                    filter: metadata.filter ? (typeof metadata.filter === "string" ? JSON.parse(metadata.filter) : metadata.filter) : {}
                };
                parameters.filter = await getUpdatedFilter(parameters.filter, queryParams, transition);
                const data = await schemaDatasource.getAll(typeId ? typeId.toString() : "", parameters);
                selectOptions = getKeyValuePairOptions(data, valueKey, displayKey);
            }
        } else if (Array.isArray(options)) {
            selectOptions = options;
        }
        const updatedValue = value ? value : defaultValue;
        dispatch(updateOptions(selectOptions, updatedValue));
        updatedValue && handleChange && handleChange(undefined, updatedValue);
    };
}

export function doUpdateSelectValue(value) {
    return async (_getState, dispatch, _transition) => {
        dispatch(updateSelectValue(value));
    };
}

function getKeyValuePairOptions(data, valueKey, displayKey) {
    const options = [];
    if (data && valueKey && displayKey) {
        displayKey = Array.isArray(displayKey) && displayKey.length > 0 ? displayKey[0] : displayKey;
        data.forEach(item => {
            options.push({ key: item[valueKey], value: item[displayKey] });
        });
    }
    return options;
}

class SelectBox extends React.Component<any, {}> {

    componentWillMount() {
        const controlProps = this.getControlSchemaProperties();
        this.props.onLoadOptions(controlProps);
    }

    componentDidUpdate() {
        const controlProps = this.getControlSchemaProperties();
        if (!this.props.selectedValue && controlProps.value) {
            this.props.onLoadOptions(controlProps);
        }
    }

    getControlSchemaProperties() {
        const registry = getDefaultRegistry();
        const { definitions } = registry;
        const schema = retrieveSchema(this.props.schema, definitions);
        return schema;
    }

    handleChange(_event, value) {
        const { handleChange } = this.getControlSchemaProperties();
        if (value && handleChange) {
            handleChange(undefined, value);
            this.props.onUpdateSelectValue(value);
        }
    }

    render() {
        const { selectOptions, schema, selectedValue } = this.props;
        if (Array.isArray(selectOptions) && schema && schema.fieldSchema) {
            schema.fieldSchema["options"] = selectOptions;
            const selectboxUIControlSchema = {
                name: `selectbox-control-${schema.fieldSchema.id}`,
                properties: {
                    ...schema,
                    "ui:widget": "dropdown_control",
                    handleChange: this.handleChange.bind(this),
                    value: selectedValue,
                },
            };
            return (<SchemaContainer schema={selectboxUIControlSchema} />);
        }
        return null;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadOptions: (controlProps) => dispatch(doLoadOptions(controlProps)),
        onUpdateSelectValue: (value) => dispatch(doUpdateSelectValue(value))
    };
};

const SelectBoxComponent = withReducer("SelectBox", reducer, mapDispatchToProps)(SelectBox);
SelectBoxComponent["displayName"] = "SelectBox";

WidgetsFactory.instance.registerFactory(SelectBoxComponent);
WidgetsFactory.instance.registerControls({
    dropdown: "SelectBox",
    'itsy:dropdown': "SelectBox"
});

export default SelectBoxComponent;
