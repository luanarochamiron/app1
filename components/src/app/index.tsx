import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { BotaoComBorda } from "../components/BtnBorda";
import { BotaoColorido } from "../components/BtnColorido";
import { useRouter } from "expo-router";

export default function TelaInicial() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			{/* Arte Geométrica Central */}
			<View style={styles.containerIconCima}>
				<View style={styles.shape1}></View>
				<View style={styles.shape2}></View>
			</View>
			<View style={styles.circle}></View>

			<View style={styles.containerIconBaixo}>
				<View style={styles.shape3}></View>
				<View style={styles.shape4}></View>
			</View>

			{/* Botões na parte inferior */}
			<View style={styles.content}>
				<BotaoComBorda titulo="Login" onPress={() => router.push("/login")} />
				<BotaoColorido titulo="Cadastro" onPress={() => router.push("/cadastroInicial")} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F3F3F3",
		justifyContent: "space-between",
	},

	containerIconCima: {
		gap: 5,
		justifyContent: "center",
		alignItems: "center",
		top: 120,
		flexDirection: "row",
	},

	shape1: {
		width: 120,
		height: 220,
		backgroundColor: "#8790FA",
		borderTopLeftRadius: 60,
		borderTopRightRadius: 60,
		borderBottomRightRadius: 50,
	},

	shape2: {
		top: 0,
		width: 120,
		height: 90,
		backgroundColor: "#D8DAF8",
		borderBottomRightRadius: 60,
		borderBottomLeftRadius: 60,
		marginTop: -100,
	},

	containerIconBaixo: {
		marginTop: -143,
		gap: 5,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},

	circle: {
		marginTop: -107,
		left: 200,
		width: 110,
		height: 110,
		borderRadius: 155,
		backgroundColor: "#5D64F5",
	},

	shape3: {
		top: 35,
		width: 130,
		height: 120,
		backgroundColor: "#5D64F5",
		borderBottomRightRadius: 50,
		borderTopLeftRadius: 50,
	},

	shape4: {
		top: 35,
		width: 120,
		height: 120,
		backgroundColor: "#D8DAF8",
		borderTopRightRadius: 50,
	},

	content: {
		paddingHorizontal: 32,
		paddingBottom: 40,
	},
});
