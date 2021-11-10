import React from 'react';
import { Spinner, VStack, Center, Heading } from 'native-base';
import { WidgetsFactory, getDefaultRegistry, retrieveSchema } from "@itsy-ui/core";
import { StyleSheet } from 'react-native';

const _getControlSchemaProperties = (props: any) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};

const LoadingIndicator = (props: any) => {
	const { loadingMessage, isLoading, className, style } = _getControlSchemaProperties(props);

	if (isLoading) {
		return <VStack style={[styles.loading, { ...style }]} >
			<Spinner size="lg" />
			<Center>
				<Heading style={styles.loadingContent}>
					{loadingMessage}
				</Heading>
			</Center>
		</VStack>
	}

	return null;
}

const styles = StyleSheet.create({
	loading: {
		width: "100%",
		zIndex: 10000,
		justifyContent: "center",
		alignItems: "center",
		margin: "auto",
		height: "100%",
		flexDirection: 'column',
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		position: "absolute",
	},
	loadingContent: {
		color: 'white',
	}
})

LoadingIndicator["displayName"] = "LoadingIndicator";

WidgetsFactory.instance.registerFactory(LoadingIndicator);
WidgetsFactory.instance.registerControls({
	loadingOverlay_control: "LoadingIndicator",
	"itsy:ui:loadingoverlay": "LoadingIndicator",
});
