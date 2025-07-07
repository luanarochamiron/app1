import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BotaoRedondo } from "../components/BotaoRedondo";
import { BotaoVoltar } from "../components/BtnVoltar";
import { InputTodoColorido } from "../components/InpuTodoColorido";
import { InputBorda } from "../components/LabelBorda";
import { useUsuarioDataBase } from "../database/useUsuarioDataBase";

export default function Login() {
	const router = useRouter();
	const { userId } = useLocalSearchParams();
	const pessoasDataBase = useUsuarioDataBase();
	const [cpf, setCpf] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [senhaVisivel, setSenhaVisivel] = useState(false);
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

	async function getLogin() {
		const emailLimpo = email.trim();

		if (!emailLimpo) {
			return Alert.alert("Atenção", "Preencha o campo email!");
		}

		if (!senha) {
			return Alert.alert("Atenção", "Preencha o campo senha!");
		}

		if (!emailLimpo || !emailLimpo.endsWith("@senacsp.edu.br")) {
			Alert.alert("Atenção", "Digite um e-mail válido do domínio @senacsp.edu.br");
			return;
		}
		if (senha.length < 4) {
			return Alert.alert("Atenção", "A senha deve ter pelo menos 4 caracteres!");
		}

		try {
			setLoading(true);

			const usuario = await pessoasDataBase.findByEmail(emailLimpo);

			if (!usuario) {
				Alert.alert("Erro", "Usuário não encontrado!");
				setLoading(false);
				return;
			}

			if (usuario.senha !== senha) {
				Alert.alert("Erro", "Senha incorreta!");
				setLoading(false);
				return;
			}

			if (usuario.ativo === false) {
                Alert.alert(
                    "Conta Desativada",
                    "Sua conta está desativada. Entre em contato com o suporte para mais informações."
                );
                setLoading(false);
                return;
            }

			setLoading(false);
			

			router.push({
                pathname: "/menu",
                params: {
                  userId: usuario.id,
                  usuarioAtual: usuario.email.trim().toLowerCase(),
                },
              });
		} catch (error) {
			console.log(error);
			Alert.alert("Erro", "Erro ao tentar fazer login.");
			setLoading(false);
		}
	}

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<BotaoVoltar titulo="Login" />
					<View style={styles.titulo}>
						<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Bem-Vindo{"\n"}de Volta!</Text>
					</View>

					<View style={styles.contentDescricao}>
						<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
							Insira seu e-mail e senha cadastrados para acessar sua conta. Esqueceu a senha? Clique em 'Esqueceu a
							Senha'.
						</Text>
					</View>

					<View style={styles.contentLabels}>
						<InputBorda
							placeholder="*Email:"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							seguro={true}
							autoCapitalize="none"
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
						></InputTodoColorido>
					</View>
					<TouchableOpacity onPress={() => router.push({ pathname: "/redefinirSenha", params: { userId } })}>
						<Text style={[styles.esqueceuSenha, { fontFamily: "Poppins_500Medium" }]}>Esqueceu a Senha?</Text>
					</TouchableOpacity>

					<View style={styles.contentBtn}>
						<BotaoRedondo onPress={getLogin} />
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
		gap: 15,
	},

	esqueceuSenha: {
		top: 20,
		left: 190,
		fontSize: 12,
		color: "rgba(9, 9, 9, 0.72)",
	},

	contentBtn: {
		marginTop: 70,
		left: 120,
	},

	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
