import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ActivityIndicator} from "react-native";
import { useUsuarioDataBase } from "../database/useUsuarioDataBase";
import { BotaoRedondo } from "../components/BotaoRedondo";
import { BotaoVoltar } from "../components/BtnVoltar";
import { Ionicons } from "@expo/vector-icons";
import { InputColorido } from "../components/LabelColorida";
import { InputColorido2 } from "../components/InputColorido2";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

export default function NovaSenha() {
	const { cpf } = useLocalSearchParams();
	const [novaSenha, setNovaSenha] = useState("");
	const [senhaVisivel, setSenhaVisivel] = useState(false);
	const { atualizarSenha } = useUsuarioDataBase();
	const rota = useRouter();
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

	const regexCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;

	const salvar = async () => {
		if (!novaSenha) {
			Alert.alert("Erro", "Digite a nova senha");
			return;
		}

		if (novaSenha.length < 4) {
			Alert.alert("Atenção", "A senha deve ter pelo menos 4 caracteres!");
			return;
		}

		if (!regexCaractereEspecial.test(novaSenha)) {
			Alert.alert("Atenção", "A senha deve conter pelo menos um caractere especial!");
			return;
		}

		await atualizarSenha(cpf, novaSenha);
		Alert.alert("Sucesso", "Senha atualizada com sucesso!");
		rota.push("/login"); // ou qualquer rota que desejar
	};

	return (
		<View style={styles.tela}>
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<BotaoVoltar titulo="Redefinir Senha" onPress={() => rota.push("/redefinirSenha")} />
					<View style={styles.titulo}>
						<Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>Redefinir{"\n"}Senha</Text>
					</View>

					<View style={styles.contentDescricao}>
						<Text style={[styles.description, { fontFamily: "Poppins_500Medium" }]}>
							Digite sua nova senha abaixo e clique em Continuar para concluir a redefinição e voltar a acessar sua conta com segurança.
						</Text>
					</View>

					<View style={styles.contentLabels}>
						<InputColorido2
							placeholder="Digite a nova senha"
							secureTextEntry={!senhaVisivel}
							onChangeText={setNovaSenha}
							value={novaSenha}
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
						<BotaoRedondo onPress={salvar}/>
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
		marginTop: 210,
	},

	description: {
		fontSize: 13,
		color: "#4B4B4B",
		lineHeight: 22,
		maxWidth: 260,
	},

	contentBtn: {
		marginTop: 130,
		left: 120,
	},

	contentLabels: {
		marginTop: 50,
		gap: 15,
	},


});
