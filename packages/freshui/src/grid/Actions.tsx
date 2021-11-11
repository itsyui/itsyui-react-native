
import React from "react"
import { Actionsheet, useDisclose, Button } from "native-base"
import { HamburgerIcon, } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, StyleSheet } from 'react-native';

export const Actions = (props: any) => {
	const { id, actions, executeCommand } = props;
	const { isOpen, onOpen, onClose } = useDisclose();

	const handleBtnPress = (evt, act) => {
		onClose();
		executeCommand(act, id, props, evt);
	}

	if (actions && Array.isArray(actions) && actions.length > 0) {
		const primaryItem = actions.find(t => t.isPrimary && t.enabled && t.icon);
		const nonPrimaryActions = actions.filter(t => primaryItem ? (t.name !== primaryItem.name && t.enabled) : t.enabled);
		const primaryAct = primaryItem && <Icon style={styles.iconStyle} name={primaryItem.icon} />
		return (
			<>
				{primaryAct}
				{nonPrimaryActions && Array.isArray(nonPrimaryActions) && nonPrimaryActions.length > 0 &&
					<>
						<Icon style={styles.iconStyle} onPress={onOpen} name="more-vert" />
						<Actionsheet isOpen={isOpen} onClose={onClose}>
							<Actionsheet.Content>
								{nonPrimaryActions.map(act => {
									return <Actionsheet.Item onPress={(evt) => handleBtnPress(evt, act)}>{act["displayText"]}</Actionsheet.Item>
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


const styles = StyleSheet.create({
	iconStyle: {
		fontSize: 25,
		height: 22,
	}
})

export default Actions;