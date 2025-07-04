import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View, Dimensions, ActivityIndicator } from "react-native";
import { useFonts, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

interface BotaoProps extends TouchableOpacityProps {
	titulo: string;
}

export function BotaoColorido({ titulo, ...rest }: BotaoProps) {
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
		backgroundColor: "#5D64F5",
		width: width * 0.7,
		paddingVertical: 16,
		alignSelf: "center",
	},

	texto: {
		color: "#ffff",
		fontSize: 20,
	},

	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
