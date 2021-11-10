import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";
import { Text, Box, Stack, Heading, View, HStack, Avatar } from 'native-base';

const Actions = {
	Type: {
		Simple: "simple",
		WithAvatar: "withAvatar",
	},
};


const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const CardControl = (props: any) => {
	const { data, className, style } = _getControlSchemaProperties(props);
	const { title, secondaryTitle, cardType, items } = data;

	switch (cardType) {
		case Actions.Type.Simple:
			return (
				<Box
					bg="white"
					shadow={8}
					rounded="lg"
					border="0.5px solid darkgray"
					style={style}
				>
					<Stack space={4} p={[4, 4, 8]}>
						<Heading size={["md", "lg", "md"]} noOfLines={2}>
							{title}
						</Heading>
						<Text lineHeight={[4, 2, 6]} noOfLines={[4, 4, 2]} >
							{secondaryTitle}
						</Text>
					</Stack>
				</Box>
			);
		case Actions.Type.WithAvatar:
			return (
				<Box
					bg="white"
					shadow={8}
					rounded="lg"
					border="0.5px solid darkgray"
					p={5}
					style={style}
				>
					<HStack width="100%" px={4}>
						<HStack space={8} alignItems="center" display="flex">
							<Avatar >
								{title && typeof (title) === "string" ? title.substr(0, 2) : ""}
							</Avatar>
							<View>
								<Heading>
									{title}
								</Heading>
								<Text lineHeight={[4, 2, 6]} noOfLines={[4, 4, 2]}>
									{secondaryTitle}
								</Text>
							</View>
						</HStack>
					</HStack>
				</Box>
			)
	}
}

CardControl.displayName = 'CardUIControl';

WidgetsFactory.instance.registerFactory(CardControl);
WidgetsFactory.instance.registerControls({
	card_control: "CardUIControl",
	'itsy:ui:card': "CardUIControl"
});