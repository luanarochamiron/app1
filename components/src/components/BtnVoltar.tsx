import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	TouchableOpacityProps,
	Image,
	View,
	Platform,
	StatusBar,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";

interface BotaoProps extends TouchableOpacityProps {
	titulo: string;
}

export function BotaoVoltar({ titulo, ...rest }: BotaoProps) {
	const router = useRouter();
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
		<TouchableOpacity
			style={styles.container}
			onPress={() => router.push("/")}
			{...rest}
			accessibilityRole="button"
			accessibilityLabel="Voltar"
		>
			<Image
				source={{
					uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACHUlEQVR4nO3dMW4UMRSH8UngHClSLCUSRAodp0jDs/WU2Npr7H0ApaKg4zZQAUHY7EopBk2SBrFSJkKK/4y/nzT9036yPVt4dxgAAACWazxoPQGGYYjrX0cxlfcx1auQyzak+jGcl+d8OA2EdT2NqX6LuY5/PKn8JEqbGFd/xbh7ppXy2DN1K9wT4yZILlvOFZEYtyuk1MeYp2thZoy7IJet51208JAYuX5/c749bj3zYnmuL/e+Te17ptffdT1tPfNiOTF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0ODF0EEMIMYQQQwgxhBBDCDGEEEMIMYTYxY9n0/Uwbi6JCKm8I4aQkOsX7vQJial+nhPEcn3VetYuxFzesmUJiXm34lAXY+vyIuT6de5KMbYvonSJlSKIKIKIIogogogiiCiCjO8peowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowoeowo//9fr8a8W7WeefHCA6LEXD+0nrcLNnP7Cqnszs7GJ63n7YLNiZLK9evN+LT1rN0I929fn1rP2GWUsOfHcUIu23hRT1rP16WYd6vpAJ/OjGmbmlYGMQRsNuMhhzgAABj+xW+/3QtIJIMIMwAAAABJRU5ErkJggg==",
				}}
				style={styles.icone}
				resizeMode="contain"
			/>
			<Text style={[styles.texto, { fontFamily: "Poppins_500Medium" }]}>{titulo}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
		left: 10,
		flexDirection: "row",
		alignItems: "center",
		zIndex: 1000,
		backgroundColor: "transparent",
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	icone: {
		width: 24,
		height: 24,
		marginRight: 8,
	},
	texto: {
		top: 1,
		color: "#5A50FF",
		fontSize: 19,
		fontWeight: "600",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
