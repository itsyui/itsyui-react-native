import React from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";
import { Text, HStack, Center, Pressable, Actionsheet, useDisclose, } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from "react-native"

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const getTabItems = (items: any) => {
	const primaryItems: any = [], moreItems: any = [];
	if (Array.isArray(items)) {
		items.forEach(item => {
			if (primaryItems.length < 4 && item.primary) {
				primaryItems.push(item);
			} else {
				moreItems.push(item);
			}
		});
	}
	return [primaryItems, moreItems];
};

const TabFooter = (props: any) => {
	const { tabitems, activeKey, handleChange } = _getControlSchemaProperties(props);
	const [selected, setSelected] = React.useState(0);
	const { isOpen, onOpen, onClose } = useDisclose();

	const [primaryItems, moreItems] = getTabItems(tabitems);

	const handlePress = (path: string, index: any, isActionSheet = false) => {
		const startWithPath = path.startsWith("/") ? path.substring(1) : path;
		setSelected(index);
		if (isActionSheet) {
			onClose();
		}
		handleChange(startWithPath);
	}

	const renderPrimaryItems = (primaryItems: any) => {
		let items: any = [];
		if (Array.isArray(primaryItems)) {
			items = primaryItems.map((item, index) => {
				const { title, icon, path, primary } = item;
				return (
					<Pressable
						key={index}
						opacity={selected === index ? 1 : 0.5}
						py={2}
						flex={1}
						onPress={() => handlePress(path, index)}
					>
						<Center>
							{icon &&
								<Icon

									name={icon}
									style={styles.actionButtonIcon}
								/>
							}
							<Text color="white" fontSize={14}>{title}</Text>
						</Center>

					</Pressable>
				)
			})
		}
		return items;
	}

	const renderItems = (primaryItems: any, moreItems: any) => {
		if (Array.isArray(primaryItems) && Array.isArray(moreItems)) {
			const pItems = renderPrimaryItems(primaryItems);
			return (
				<>
					{pItems}
					{moreItems.length > 0 &&
						<>
							<Icon style={styles.actionButtonIcon} onPress={onOpen} name="more-vert" />
							<Actionsheet isOpen={isOpen} onClose={onClose}>
								<Actionsheet.Content>
									{moreItems.map(act => {
										const { title, icon, path, primary } = act;
										return <Actionsheet.Item onPress={(evt) => handlePress(path, primaryItems.length + 1, true)}>{title}</Actionsheet.Item>
									})}
								</Actionsheet.Content>
							</Actionsheet>
						</>

					}
				</>
			)
		}
		return null;
	}

	return (
		<HStack bg="primary.500" alignItems="center" safeAreaBottom shadow={6}>
			{renderItems(primaryItems, moreItems)}
		</HStack>
	)
}

const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 25,
		height: 22,
		color: 'white',
	},
});


TabFooter.displayName = "TabFooter";

WidgetsFactory.instance.registerFactory(TabFooter);
WidgetsFactory.instance.registerControls({
	navbar_bottom_control: TabFooter.displayName,
});