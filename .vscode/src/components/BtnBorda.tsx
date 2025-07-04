import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, Dimensions, View, ActivityIndicator } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

interface BotaoProps extends TouchableOpacityProps {
	titulo: string;
}

export function BotaoComBorda({ titulo, ...rest }: BotaoProps) {
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
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
		<TouchableOpacity style={styles.botao} {...rest}>
			<Text style={[styles.texto, { fontFamily: "Poppins_700Bold" }]}>{titulo}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	botao: {
		borderRadius: 20,
		alignItems: "center",
		marginVertical: 8,
		borderColor: "#5D64F5",
		borderWidth: 3,
		width: width * 0.7,
		paddingVertical: 16,
		alignSelf: "center",
	},
	texto: {
		color: "#5D64F5",
		fontSize: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
