import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { BotaoComBorda } from "../components/BtnBorda";
import { BotaoColorido } from "../components/BtnColorido";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BotaoVoltar } from "../components/BtnVoltar";
import { useFonts, Poppins_700Bold, Poppins_500Medium, Poppins_600SemiBold, Poppins_400Regular } from "@expo-google-fonts/poppins";

export default function TelaNomeSocial() {
	const router = useRouter();
	const { userId } = useLocalSearchParams();
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_400Regular,
	});

	function redirecionarUsuario(comNomeSocial: boolean) {
		router.push({
			pathname: "/cadastroCompleto",
			params: {
				userId: userId.toString(),
				comNomeSocial: comNomeSocial ? "sim" : "nao",
			},
		});
	}

	if (!fontsLoaded) {
		// Mostra carregamento enquanto a fonte não estiver pronta
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#5D64F5" />
			</View>
		);
	}

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<BotaoVoltar titulo="Nome Social" onPress={() => router.push("/cadastroInicial")} />
					<View style={styles.titulo}>
						<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Você usa{"\n"}nome social?</Text>
					</View>
					<View style={styles.contentDescricao}>
						<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
							Nome social é o nome pelo qual você prefere ser chamado, diferente do que está nos seus documentos
							oficiais. Caso você tenha, clique em "Sim". Se não, clique em "Não" para continuar.
						</Text>
					</View>
					<View style={styles.contentBotao}>
						<BotaoComBorda titulo="Sim" onPress={() => redirecionarUsuario(true)} />
						<BotaoColorido titulo="Não" onPress={() => redirecionarUsuario(false)} />
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	tela: {
		flex: 1,
		backgroundColor: "#F3F3F3",
		justifyContent: "flex-start",
	},

	container: {
		flex: 1,
		backgroundColor: "#F3F3F3",
	},

	content: {
		top: 10,
		left: 10,
		flex: 1,
		paddingHorizontal: 32,
	},

	titulo: {
		top: 150,
		left: 15,
	},

	title: {
		fontSize: 40,
		color: "#5D64F5",
		lineHeight: 40,
	},

	contentDescricao: {
		paddingHorizontal: 15,
		marginTop: 200,
	},

	description: {
		fontSize: 13,
		color: "#4B4B4B",
		lineHeight: 22,
		maxWidth: 260,
	},

	contentBotao: {
		top: 150,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
