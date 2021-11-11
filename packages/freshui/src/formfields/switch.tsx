import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	FormControl,
	HStack,
	Text,
	Switch
} from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const SwitchControl = (props: any) => {
	const controlProps = _getControlSchemaProperties(props);
	const { fieldSchema, error } = controlProps;
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

	return (
		<FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle} >
			<HStack>
				<FormControl.Label>{fieldSchema.displayName}</FormControl.Label>
				<Switch
					key={fieldSchema.id}
					isChecked={controlProps.value !== undefined ? controlProps.value : fieldSchema.checked ? fieldSchema.checked : false}
					onToggle={(val) => controlProps.handleChange && controlProps.handleChange(undefined, val)}
				/>
			</HStack>
			<FormControl.ErrorMessage>
				{error}
			</FormControl.ErrorMessage>
			{fieldSchema.helptext &&
				<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
			}
		</FormControl>
	)
}


SwitchControl['displayName'] = 'SwitchTypeControl';

WidgetsFactory.instance.registerFactory(SwitchControl);
WidgetsFactory.instance.registerControls({
	switch: 'SwitchTypeControl',
	'itsy:form:switch': 'SwitchTypeControl'
});