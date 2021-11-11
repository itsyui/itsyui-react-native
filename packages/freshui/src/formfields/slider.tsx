import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import {
	FormControl,
	HStack,
	Text,
	Slider
} from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const SliderControl = (props: any) => {
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
	return (
		<FormControl isRequired={fieldSchema.required} isInvalid={error} isDisabled={fieldSchema.readOnly} style={customStyle} >
			<FormControl.Label>{fieldSchema.displayName}</FormControl.Label>
			<Slider
				key={fieldSchema.id}
				orientation={fieldSchema.orientation !== undefined ? fieldSchema.orientation : "horizontal"}
				value={controlProps.value !== undefined ? controlProps.value : fieldSchema.defaultValue ? fieldSchema.defaultValue : 0}
				step={fieldSchema.step !== undefined ? fieldSchema.step : undefined}
				minValue={fieldSchema.minimum}
				maxValue={fieldSchema.max}
				onChange={(val) => handleChange && handleChange(undefined, val)}
			>
				<Slider.Track>
					<Slider.FilledTrack />
				</Slider.Track>
				<Slider.Thumb />
			</Slider>
			<FormControl.ErrorMessage>
				{error}
			</FormControl.ErrorMessage>
			{fieldSchema.helptext &&
				<FormControl.HelperText>{fieldSchema.helptext}</FormControl.HelperText>
			}
		</FormControl>
	)
}


SliderControl['displayName'] = 'SlideTypeControl';

WidgetsFactory.instance.registerFactory(SliderControl);
WidgetsFactory.instance.registerControls({
	slider: 'SlideTypeControl',
	'itsy:form:slider': 'SlideTypeControl'
});