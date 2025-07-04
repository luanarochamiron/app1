import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CircularArrowButtonProps {
	onPress?: (event: GestureResponderEvent) => void;
	style?: ViewStyle;
}

export function BotaoRedondo({ onPress, style }: CircularArrowButtonProps) {
	return (
		<TouchableOpacity style={[styles.button, style]} onPress={onPress}>
			<Ionicons name="arrow-forward" size={24} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#5D64F5",
		borderRadius: 50,
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
});
