import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
} from 'react-native';

import { WidgetsFactory, getDefaultRegistry, retrieveSchema, } from "@itsy-ui/core";
import ImagePicker from 'react-native-image-picker';

const _getControlSchemaProperties = (props) => {
	const registry = getDefaultRegistry();
	const { definitions } = registry;
	const schema = retrieveSchema(props.schema, definitions);
	return schema;
};


const FileUpload = (props) => {
	const controlProps = _getControlSchemaProperties(props);
	const { fieldSchema, gridStyle } = controlProps;
	const [resourcePath, setResourcePath] = useState("")
	const customStyle = fieldSchema.style ? fieldSchema.style : {};

	const selectFile = (e) => {
		var options = {
			title: 'Select Image',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		ImagePicker.showImagePicker(options, res => {
			console.log('Response = ', res);

			if (res.didCancel) {
				console.log('User cancelled image picker');
			} else if (res.error) {
				console.log('ImagePicker Error: ', res.error);
			} else if (res.customButton) {
				console.log('User tapped custom button: ', res.customButton);
				alert(res.customButton);
			} else {
				const base64Content = 'data:image/jpeg;base64,' + res.data;
				controlProps.handleChange && controlProps.handleChange(e, base64Content);
				setResourcePath(base64Content)
			}
		});
	};

	return <View style={customStyle}>
		<TouchableOpacity onPress={selectFile} style={styles.button}  >
			<Text style={styles.buttonText}>Select File</Text>
		</TouchableOpacity>
		{resourcePath ?
			<Image
				source={{
					//	uri: 'data:image/jpeg;base64,' + resourcePath.data,
					uri: resourcePath,
				}}
				style={{ width: 200, height: 200, marginBottom: 10 }}
			/> : null
		}
	</View>
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	button: {
		width: 150,
		height: 30,
		backgroundColor: '#3740ff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		marginBottom: 12,
		marginTop: 10
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 15,
		color: '#fff'
	}
});

FileUpload['displayName'] = 'FileUpload';

WidgetsFactory.instance.registerFactory(FileUpload);
WidgetsFactory.instance.registerControls({
	fileupload: "FileUpload"
});