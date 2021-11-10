import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	FormControl,
	HStack,
	Text,
	Checkbox
} from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const getCheckbox = (fieldSchema: any, controlProps: any) => {
	let result = [];
	if (fieldSchema && fieldSchema.options) {
		const { value, handleChange } = controlProps;
		result = fieldSchema.options.map((item, index) => {
			const key = typeof item === "string" ? item : item.key;
			const itemValue = typeof item === "string" ? item : item.value;
			const selectedIndex = value instanceof Array ? value.findIndex(s => s === key) : -1;
			return (
				<Checkbox
					key={fieldSchema.id}
					color={fieldSchema.type !== undefined ? fieldSchema.type : "green"}
					checked={selectedIndex > -1 ? true : false}
					disabled={fieldSchema.readOnly}
					value={key}
					onChange={e => handleChange && handleChange(e, e)}
				>
					{itemValue}
				</Checkbox>
			);
		});
	}
	return result;
}

const CheckboxControl = (props: any) => {
	const controlProps = _getControlSchemaProperties(props);
	const { fieldSchema, error, handleChange } = controlProps;
	const customStyle = fieldSchema.style ? fieldSchema.style : {};

	if (controlProps.isReadonly) {
		return (
			<HStack width="100%" px={8}>
				<HStack space={8} alignItems="center" >
					<Text numberOfLines={1} width="100px" ellipsizeMode="tail" >
						{fieldSchema.displayName}
					</Text>
					<Text numberOfLines={1} width="100px" ellipsizeMode="tail" >
						{controlProps.value}
					</Text>
				</HStack>
			</HStack>
		)
	}

	return <FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle}>
		{getCheckbox(fieldSchema, controlProps)}
		<FormControl.ErrorMessage>
			{error}
		</FormControl.ErrorMessage>
		{fieldSchema.helptext &&
			<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
		}
	</FormControl>
}


CheckboxControl["displayName"] = "CheckboxControl";

WidgetsFactory.instance.registerFactory(CheckboxControl);
WidgetsFactory.instance.registerControls({
	checkbox_control: "CheckboxControl",
	"itsy:form:checkbox": "CheckboxControl"
});
