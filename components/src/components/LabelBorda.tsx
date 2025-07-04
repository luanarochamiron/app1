import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, Dimensions, ActivityIndicator } from "react-native";
import { useFonts, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";

interface InputPadraoProps extends TextInputProps {
	seguro?: boolean; // para campos de senha
}

export function InputBorda({ seguro = false, ...rest }: InputPadraoProps) {
	const [value, setValue] = useState("");
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
		Poppins_500Medium,
	});

	if (!fontsLoaded) {
		// Mostra carregamento enquanto a fonte não estiver pronta
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#5D64F5" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
				secureTextEntry={seguro}
				onChangeText={setValue}
				value={value}
				{...rest}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 16,
		paddingHorizontal: 10,
	},

	inputContainer: {
		position: "relative",
		justifyContent: "center",
	},

	label: {
		position: "absolute",
		left: 32,
		color: "rgba(9, 9, 9, 0.66)",
		fontSize: 13,
		zIndex: 1,
	},

	input: {
		height: 59,
		width: 300,
		borderWidth: 2,
		borderColor: "#5A50FF",
		borderRadius: 15,
		paddingLeft: 32,
		paddingRight: 12,
		alignSelf: "center",
		color: "rgba(9, 9, 9, 0.66)",
		fontSize: 13,
		backgroundColor: "#f5f5f5",
		textAlignVertical: "center",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
