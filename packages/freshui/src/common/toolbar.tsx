import React, { useState } from 'react';
import { WidgetsFactory } from "@itsy-ui/core";
import { StyleSheet } from "react-native"
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FABs = (props) => {
	const { items, itemClick, style } = props.schema;

	if (Array.isArray(items) && items.length == 1) {
		return <ActionButton
			buttonColor='#5067FF'
			onPress={() => itemClick(items[0].name, items[0])}
			useNativeFeedback={false}
			style={style}
		/>
	}

	return <ActionButton
		useNativeFeedback={false}
		buttonColor='#5067FF'
		position="right"
		useNativeDriver={false}
		style={style}
	>
		{
			Array.isArray(items) && items.map(item => {
				return <ActionButton.Item
					key={item.name}
					title={item.displayText}
					onPress={() => itemClick(item.name, item)}
				>
					{item.icon &&
						<Icon name={item.icon} style={styles.actionButtonIcon} />
					}

				</ActionButton.Item>
			})
		}
	</ActionButton>
}

const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
});

FABs['displayName'] = 'FABs';

WidgetsFactory.instance.registerFactory(FABs);
WidgetsFactory.instance.registerControls({
	toolbar_control: "FABs",
});
