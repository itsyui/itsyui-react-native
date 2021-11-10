import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	FormControl,
	HStack,
	Text,
	Radio
} from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};


const getRadioOptions = (options: any) => {
	let result = [];
	if (options) {
		result = options.map(t => {
			if (Object.prototype.toString.call(t) === "[object String]") {
				return <Radio key={t} value={t}>{t}</Radio>;
			} else {
				// expecting as key value object pair
				return <Radio key={t.key} value={t.key}>{t.value} </Radio>;
			}
		});
	}
	return result;
}
const RadioGroup = (props: any) => {
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

	return <FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle} >
		<FormControl.Label>{fieldSchema.displayName}</FormControl.Label>
		<Radio.Group
			name="myRadioGroup"
			value={controlProps.value}
			onChange={(val) => {
				controlProps.handleChange && controlProps.handleChange(val, val);
			}}
		>
			{getRadioOptions(fieldSchema.options)}
		</Radio.Group>
		<FormControl.ErrorMessage>
			{error}
		</FormControl.ErrorMessage>
		{fieldSchema.helptext &&
			<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
		}
	</FormControl>
}


RadioGroup["displayName"] = "RadioGroupControl";

WidgetsFactory.instance.registerFactory(RadioGroup);
WidgetsFactory.instance.registerControls({
	radio_control: "RadioGroupControl",
});
