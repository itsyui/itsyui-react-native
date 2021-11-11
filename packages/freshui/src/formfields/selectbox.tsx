import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	FormControl,
	HStack,
	Text,
	Select
} from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const getSelectOptions = (options: []) => {
	return Array.isArray(options) && options.map((t, index) => {
		if (t) {
			if (Object.prototype.toString.call(t) === "[object String]") {
				return <Select.Item key={t} label={t} value={t} />;
			} else {
				// expecting as key value object pair
				return <Select.Item key={t.key} label={t.value} value={t.key} />;
			}
		}
	});
}

const SelectBoxControl = (props: any) => {
	const controlProps = _getControlSchemaProperties(props);
	const { fieldSchema, error, handleChange, value } = controlProps;
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

	return <FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle} >
		<FormControl.Label>{fieldSchema.displayName}</FormControl.Label>
		<Select
			key={fieldSchema.id}
			selectedValue={value ? value : ""}
			onValueChange={(itemValue) => {
				handleChange({}, itemValue)
			}}
		>
			{getSelectOptions(fieldSchema.options)}
		</Select>
		<FormControl.ErrorMessage>
			{error}
		</FormControl.ErrorMessage>
		{fieldSchema.helptext &&
			<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
		}
	</FormControl>
}


SelectBoxControl['displayName'] = 'SelectBoxControl';

WidgetsFactory.instance.registerFactory(SelectBoxControl);
WidgetsFactory.instance.registerControls({
	dropdown_control: 'SelectBoxControl',
});