import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons"; // ícone opcional
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";
import { InputBorda } from "../components/LabelBorda";
import { InputColorido } from "../components/LabelColorida";
import { useUsuarioDataBase } from "../database/useUsuarioDataBase";

function validarCPF(cpf: string): boolean {
	cpf = cpf.replace(/[^\d]+/g, "");
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

	let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += parseInt(cpf.charAt(i), 10) * (10 - i);
	}
	let resto = (soma * 10) % 11;
	if (resto === 10 || resto === 11) resto = 0;
	if (resto !== parseInt(cpf.charAt(9), 10)) return false;

	soma = 0;
	for (let i = 0; i < 10; i++) {
		soma += parseInt(cpf.charAt(i), 10) * (11 - i);
	}
	resto = (soma * 10) % 11;
	if (resto === 10 || resto === 11) resto = 0;
	return resto === parseInt(cpf.charAt(10), 10);
}

function formatarCPF(valor: string): string {
	valor = valor.replace(/\D/g, "");
	valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
	valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
	valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	return valor;
}

export default function VerificarUsuario() {
	const router = useRouter();
	const { userId } = useLocalSearchParams();
	const pessoasDataBase = useUsuarioDataBase();
	const [cpf, setCpf] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_400Regular,
	});

	if (!fontsLoaded) {
		// Mostra carregamento enquanto a fonte não estiver pronta
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#5D64F5" />
			</View>
		);
	}

	async function verificarDados() {
		const cpfLimpo = cpf.replace(/\D/g, "").trim();
		const emailLimpo = email.trim();

		if (!cpfLimpo || !emailLimpo) {
			Alert.alert("Erro", "Por favor, preencha CPF e Email");
			return;
		}

		if (!validarCPF(cpfLimpo)) {
			Alert.alert("Erro", "Informe um CPF válido no formato 000.000.000-00");
			return;
		}

		if (!emailLimpo.endsWith("@senacsp.edu.br")) {
			Alert.alert("Atenção", "Digite um e-mail do domínio @senacsp.edu.br");
			return;
		}

		try {
			setLoading(true);

			// CORRETO: usar a função existente findByCpfEmail
			const usuario = await pessoasDataBase.findByCpfEmail(cpfLimpo, emailLimpo);

			if (!usuario) {
				Alert.alert("Erro", "Usuário não encontrado com CPF e Email informados.");
				setLoading(false);
				return;
			}

			setLoading(false);
			router.push({
				pathname: "/novaSenha",
				params: { cpf: cpfLimpo },
			});
		} catch (error) {
			console.log(error);
			Alert.alert("Erro", "Erro ao buscar usuário.");
			setLoading(false);
		}
	}

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<BotaoVoltar titulo="Redefinir Senha" onPress={() => router.push("/login")} />
					<View style={styles.titulo}>
						<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Esqueceu a{"\n"}Senha?</Text>
					</View>

					<View style={styles.contentDescricao}>
						<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
							Insira seu CPF e e-mail cadastrados para recuperar o acesso à sua conta.
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
						<View style={styles.containerlabel2}>
							<InputColorido
								placeholder="*Email:"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								seguro={true}
							/>
						</View>
					</View>

					<View style={styles.contentBtn}>
						<TouchableOpacity
							style={[styles.button, loading && styles.buttonDisabled]}
							onPress={verificarDados}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Ionicons name="arrow-forward" size={24} color="white" />
							)}
						</TouchableOpacity>
					</View>

				</View>
			</SafeAreaView>
		</View>
	);
}


const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	tela: {
		flex: 1,
		backgroundColor: "#F3F3F3",
		justifyContent: "flex-start",
	},

	content: {
		top: 10,
		left: 10,
		flex: 1,
		paddingHorizontal: 32,
	},

	container: {
		flex: 1,
		backgroundColor: "#F3F3F3",
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
		gap: 15,
	},

	containerlabel2: {
		right: 20,
	},

	contentBtn: {
		marginTop: 120,
		left: 120,
	},

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
	buttonDisabled: {
		backgroundColor: "#A0CFFF",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
	link: {
		color: "blue",
		marginBottom: 12,
		textAlign: "center",
	},
});
