import React from 'react';
import { Box, Pressable, View } from 'native-base';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema, SchemaContainer } from "@itsy-ui/core";
import { StyleSheet, Dimensions, StatusBar, TouchableOpacity, Text, Animated, } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import "./tabFooterbar";

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

enum TabTypes {
	Tab = "tab",
	TabNav = "tab-nav",
}

const initialLayout = { height: 0, width: Dimensions.get('window').width };

const Tabs = (props: any) => {
	const { activeKey, tabitems, className, style, tabType } = _getControlSchemaProperties(props);

	const onChange = (currentKey) => {
		const { handleChange } = _getControlSchemaProperties(props);
		handleChange(currentKey, tabType);
	}

	const renderTabBar = (props: any) => {
		const inputRange = props.navigationState.routes.map((x, i) => i);
		return (
			<Box flexDirection="row">
				{props.navigationState.routes.map((route, i) => {
					const opacity = props.position.interpolate({
						inputRange,
						outputRange: inputRange.map((inputIndex) =>
							inputIndex === i ? 1 : 0.5
						),
					});

					return (
						<Box
							flex={1}
							alignItems='center'
						>
							<Pressable

								onPress={() => {
									console.log(i);
									onChange(i);
								}}>
								<Animated.Text style={{ opacity }}>
									{route.title}
								</Animated.Text>
							</Pressable>
						</Box>

					);
				})}
			</Box>
		);
	};

	const getTabItem = () => {
		const currentTabItem = Array.isArray(tabitems) && tabitems[activeKey];
		return (
			<SchemaContainer schema={{
				name: "tab-items",
				properties: {
					"ui:widget": "tabItems",
					"items": currentTabItem ? [currentTabItem] : [],
					"activeItem": activeKey,
				}
			}} />
		)

	}

	const renderScene = (tabitems) => {
		const screen: any = {}
		Array.isArray(tabitems) && tabitems.forEach(tItem => {
			screen[tItem['key']] = getTabItem
		});

		return SceneMap(screen);
	}

	const renderTabNavItems = () => {
		const schema = {
			name: `tabs-nav-ui-control`,
			properties: {
				"ui:widget": "navbar_bottom_control",
				handleChange: onChange,
				activeKey,
				tabitems,
			},
		};
		return <SchemaContainer schema={schema} />;
	}

	if (tabType === TabTypes.TabNav) {
		return renderTabNavItems();
	}
	return <>
		<Box flex={1} style={style}  >
			<TabView
				navigationState={{ index: activeKey, routes: tabitems }}
				renderScene={renderScene(tabitems)}
				renderTabBar={renderTabBar}
				onIndexChange={onChange}
				initialLayout={initialLayout}
				style={{ marginTop: StatusBar.currentHeight }}
				scrollEnabled={true}
				tabStyle={{ width: "100%" }}
			/>
		</Box>
	</>
}


Tabs["displayName"] = "TabsUIControl";

WidgetsFactory.instance.registerFactory(Tabs);
WidgetsFactory.instance.registerControls({
	tabs_control: "TabsUIControl",
	"itsy:ui:tabs": "TabsUIControl"
});
