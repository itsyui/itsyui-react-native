import React, { useEffect, useRef } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";
import { Image, Pressable, Text } from 'native-base';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const ImageControl = (props: any) => {
	const { loaded, onClick, imgSrc, image_width, image_height, className, style } = _getControlSchemaProperties(props);
	const customStyle = style ? { ...style } : {};

	if (loaded) {
		<Pressable
			onPress={onClick}
		>
			<Image
				source={imgSrc}
				width={image_width} height={image_height}
				alt="image"
				style={customStyle}
			/>
		</Pressable>
	}
	return <Text >Loading image</Text>

}

ImageControl["displayName"] = "ImageUIControl";

WidgetsFactory.instance.registerFactory(ImageControl);
WidgetsFactory.instance.registerControls({
	"itsy:ui:image": "ImageUIControl",
});
