import React from 'react';

import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	TextArea, FormControl,
	HStack,
	Text
} from "native-base";

const _getControlSchemaProperties = (props) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const TextAreaControl = (props) => {
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
	return <FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle}>
		<FormControl.Label>{fieldSchema.displayName}</FormControl.Label>
		<TextArea
			key={fieldSchema.id}
			placeholder={fieldSchema.placeholder}
			h={20}
			onChangeText={(e) =>
				controlProps.handleChange && controlProps.handleChange(e, e)
			} />
		<FormControl.ErrorMessage>
			{error}
		</FormControl.ErrorMessage>
		{fieldSchema.helptext &&
			<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
		}
	</FormControl>
}

TextAreaControl['displayName'] = 'textarea';

WidgetsFactory.instance.registerFactory(TextAreaControl);
WidgetsFactory.instance.registerControls({
	textarea: "TextAreaControl"
});