import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useId, useState } from "react";
import { ScrollView, ActivityIndicator, SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useFonts, Poppins_700Bold, Poppins_500Medium, Poppins_600SemiBold, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { BotaoVoltar } from "../components/BtnVoltar";
import { InputBorda } from "../components/LabelBorda";
import { InputColorido } from "../components/LabelColorida";
import { BotaoRedondo } from "../components/BotaoRedondo";
import { useUsuarioDataBase } from "../database/useUsuarioDataBase";
import { InputTodoColorido } from "../components/InpuTodoColorido";
import { Ionicons } from "@expo/vector-icons";

export default function CadastroCompletoSemNomeSocial() {
	const router = useRouter();
	const { userId, comNomeSocial } = useLocalSearchParams();
	const [nome, setNome] = useState("");
	const [nomeSocial, setNomeSocial] = useState("");
	const pessoasDataBase = useUsuarioDataBase();
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [senhaVisivel, setSenhaVisivel] = useState(false);
	const regexCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;
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

	async function finalizarCadastro() {
		const emailLimpo = email.trim();

		if (!nome || nome.trim().length < 4) {
			Alert.alert("Atenção", "O nome deve ter pelo menos 4 caracteres!");
			return;
		}

		if (!emailLimpo || !emailLimpo.endsWith("@senacsp.edu.br")) {
			Alert.alert("Atenção", "Use um e-mail do domínio @senacsp.edu.br");
			return;
		}

		if (!senha || senha.length < 4) {
			Alert.alert("Atenção", "A senha deve ter pelo menos 4 caracteres.");
			return;
		}

		if (!regexCaractereEspecial.test(senha)) {
			Alert.alert("Atenção", "A senha deve conter um caractere especial!");
			return;
		}

		try {
			await pessoasDataBase.preencherUsuario({
				id: userId.toString(),
				nome,
				nomeSocial: nomeSocial || null, // ou null, dependendo do que aceita seu banco
				email: emailLimpo,
				senha,
			});

			Alert.alert("Sucesso", "Cadastro concluído!");

			router.push({
				pathname: "/menu",
				params: { userId },
			});
		} catch (error) {
			console.log(error);
			Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
		}
	}

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						<BotaoVoltar titulo="Cadastro" onPress={() => router.push({ pathname: "/nomeSocial", params: { userId } })} />
					</View>

					<View style={styles.content2}>
						<View style={styles.titulo}>
							<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Vamos{"\n"}Começar!</Text>
						</View>

						<View style={styles.contentDescricao}>
							<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
								Cadastre-se no CrescEdu com seus dados e uma senha segura para começar seus estudos.
							</Text>
						</View>
					</View>
					<View style={styles.contentLabels}>
						<InputBorda
							placeholder="*Nome:"
							value={nome}
							onChangeText={setNome}
							keyboardType="default"
							autoCapitalize="words"
						/>

						{comNomeSocial === "sim" && (
							<InputBorda
								placeholder="*Nome social:"
								value={nomeSocial}
								onChangeText={setNomeSocial}
								keyboardType="default"
								autoCapitalize="words"
							/>
						)}

						<InputColorido
							placeholder="*Email:"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							seguro={true}
						/>

						<InputTodoColorido
							placeholder="*Senha:"
							value={senha}
							onChangeText={setSenha}
							keyboardType="default"
							secureTextEntry={!senhaVisivel}
							suffixIcon={ // ← ícone dentro do input
								<TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
									<Ionicons
										name={senhaVisivel ? "eye-off" : "eye"}
										size={22}
										color="#5D64F5"
									/>
								</TouchableOpacity>
							}
						/>
					</View>

					<View style={styles.contentBtn}>
						<BotaoRedondo onPress={finalizarCadastro} />
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	tela: {
		flex: 1,
		backgroundColor: "#F3F3F3",
	},

	container: {
		flex: 1,
		backgroundColor: "#F3F3F3",
	},

	scrollContent: {
		paddingBottom: 40,
	},

	content: {
		left: 10,
		top: 10,
		paddingHorizontal: 32,
	},

	content2: {
		left: 30,
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
		marginTop: 190,
	},

	description: {
		fontSize: 14,
		color: "#4B4B4B",
		lineHeight: 22,
		maxWidth: 290,
	},

	contentLabels: {
		marginTop: 60,
		bottom: 40,
		paddingHorizontal: 32,
	},

	contentBtn: {
		left: 120,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
