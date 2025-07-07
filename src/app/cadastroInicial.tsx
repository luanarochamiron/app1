import { useUsuarioDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BotaoRedondo } from "../components/BotaoRedondo";
import { BotaoVoltar } from "../components/BtnVoltar";
import { InputBorda } from "../components/LabelBorda";
import { InputColorido } from "../components/LabelColorida";

export default function Etapa1() {
	const router = useRouter();
	const [cpf, setCpf] = useState("");
	const [dataNascimento, setDataNascimento] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [value, setValue] = useState("");
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_400Regular,
	});

	const usuarioDb = useUsuarioDataBase();

	if (!fontsLoaded) {
		// Mostra carregamento enquanto a fonte não estiver pronta
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#5D64F5" />
			</View>
		);
	}

	function validarCPF(cpf: string): boolean {
		cpf = cpf.replace(/[^\d]+/g, "");
		if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

		let soma = 0;
		for (let i = 0; i < 9; i++) soma += Number(cpf.charAt(i)) * (10 - i);
		let resto = (soma * 10) % 11;
		if (resto === 10 || resto === 11) resto = 0;
		if (resto !== Number(cpf.charAt(9))) return false;

		soma = 0;
		for (let i = 0; i < 10; i++) soma += Number(cpf.charAt(i)) * (11 - i);
		resto = (soma * 10) % 11;
		if (resto === 10 || resto === 11) resto = 0;
		return resto === Number(cpf.charAt(10));
	}

	function formatarCPF(valor: string): string {
		valor = valor.replace(/\D/g, "");
		valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
		valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
		valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
		return valor;
	}

	function onChangeDate(event: any, selectedDate?: Date) {
		setShowDatePicker(Platform.OS === "ios");
		if (selectedDate) {
			const formato = selectedDate.toISOString().split("T")[0];
			setDataNascimento(formato);
		}
	}

	async function avancar() {
		const cpfNumerico = cpf.replace(/\D/g, "");

		if (!cpfNumerico || !validarCPF(cpfNumerico)) {
			Alert.alert("Atenção", "Informe um CPF válido!");
			return;
		}

		if (!dataNascimento) {
			Alert.alert("Atenção", "Selecione a data de nascimento!");
			return;
		}

		const userId = await usuarioDb.createInicial({
			cpf: cpfNumerico,
			dataNascimento: dataNascimento,
		});

		router.push({
			pathname: "/nomeSocial",
			params: { userId },
		});
	}

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<BotaoVoltar titulo="Cadastro" onPress={() => router.push("/")} />
					<View style={styles.titulo}>
						<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Vamos{"\n"}Começar!</Text>
					</View>
					<View style={styles.contentDescricao}>
						<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
							Que tal iniciar seu cadastro com toda a segurança? Informe seu CPF e data de nascimento para garantirmos a
							proteção das suas informações.
						</Text>
					</View>
					<View style={styles.contentLabels}>
						<InputBorda
							placeholder="*CPF:"
							secureTextEntry={false}
							keyboardType="numeric"
							onChangeText={(text) => setCpf(formatarCPF(text))}
							value={cpf}
							maxLength={14}
						/>
					</View>

					<View style={styles.containerData}>
						<TouchableOpacity onPress={() => setShowDatePicker(true)}>
							<InputColorido placeholder="*Data de Nascimento:" editable={false} value={dataNascimento} />
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								value={dataNascimento ? new Date(dataNascimento) : new Date()}
								mode="date"
								display="default"
								onChange={onChangeDate}
								maximumDate={new Date(2014, 11, 31)}
								minimumDate={new Date(1975, 0, 1)}
							/>
						)}
					</View>
					<View style={styles.contentBtn}>
						<BotaoRedondo onPress={avancar} />
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

	contentLabels: {
		marginTop: 30,
	},

	esqueceuSenha: {
		left: 190,
		fontSize: 12,
		color: "rgba(9, 9, 9, 0.72)",
	},

	contentBtn: {
		marginTop: 110,
		left: 120,
	},

	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	containerData: {
		marginLeft: -20,
	},
});
