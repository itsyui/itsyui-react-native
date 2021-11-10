import React, { useEffect, useRef } from 'react';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, withReducer } from "@itsy-ui/core";
import { StyleSheet } from 'react-native';
import { VStack, Input, Button, IconButton, Text, NativeBaseProvider, Center, Box } from 'native-base';
import { Observable } from 'rx-lite';
import Icon from 'react-native-vector-icons/MaterialIcons';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const SearchControl = (props: any) => {

	const searchInput = useRef(null);
	const { placeholder, style } = _getControlSchemaProperties(props);
	// useEffect(() => {
	// 	if (searchInput && searchInput.current) {
	// 		Observable.fromEvent(searchInput.current, "keyup")
	// 			.map(x => x.currentTarget.value)
	// 			.debounce(1000)
	// 			.subscribe(x => onChange(x));
	// 	}
	// }, []);

	const onChange = (value: string) => {
		const { controlID } = _getControlSchemaProperties(props);
		props.transition({
			...controlID && {
				controlID,
				strict: true,
			},
			type: "SEARCH_CLICKED",
			data: value,
		});
	}

	return (
		<VStack width="100%" space={2} style={style}>
			<Input
				key="input-with-icon-adornment"
				inputRef={searchInput}
				placeholder={placeholder}
				bg="#fff"
				width="100%"
				borderRadius={5}
				py={3}
				px={1}
				fontSize={20}
				_web={{
					_focus: { borderColor: 'red', style: { boxShadow: 'none' } },
				}}
				InputLeftElement={<Icon style={styles.actionButtonIcon} color="gray" name="search" />}
				onChangeText={(val => onChange(val))}
			/>
		</VStack>
	)

}

const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 25,
		height: 22,
	},
});


const mapDispatchToProps = () => {
	return {};
};

const SearchC = withReducer('Search', mapDispatchToProps)(SearchControl);
SearchC.displayName = 'Search';

WidgetsFactory.instance.registerFactory(SearchC);
WidgetsFactory.instance.registerControls({
	grid_search: 'Search',
	'itsy:ui:search': 'Search'
});

export default SearchControl;
