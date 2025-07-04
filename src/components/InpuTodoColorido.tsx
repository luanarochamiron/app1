import React from "react";
import { View, TextInput, StyleSheet, TextInputProps, ActivityIndicator} from "react-native";
import { useFonts, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";

interface InputColoridoProps extends TextInputProps {
	suffixIcon?: React.ReactNode;
}



export function InputTodoColorido({ suffixIcon, style, ...rest }: InputColoridoProps) {
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
		<View style={styles.inputWrapper}>
			<TextInput
				style={[styles.input, style, { fontFamily: "Poppins_500Medium" }]}
				placeholderTextColor="#4B4B4B"
				{...rest}
			/>
			{suffixIcon && <View style={styles.iconContainer}>{suffixIcon}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 59,
		width: 300,
		borderRadius: 15,
		paddingLeft: 32,
		paddingRight: 12,
		alignSelf: "center",
		color: "rgba(9, 9, 9, 0.66)",
		fontSize: 13,
		backgroundColor: "rgba(93, 100, 245, 0.44)", // 44% da cor #5D64F5
		textAlignVertical: "center",
	},
	input: {
		flex: 1,
		height: 50,
		color: "#000",
		fontSize: 14,
	},
	iconContainer: {
		marginRight: 10,
	},
    loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
