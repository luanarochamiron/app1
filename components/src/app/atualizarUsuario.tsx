import { atualizarUsuario, buscarUsuarioPorCPF } from "@/database/useUsuarioDataBase";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Button, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AtualizarUsuario() {
	const cpf = "12345678900"; // Substitua pelo CPF dinâmico do usuário logado

	const [nome, setNome] = useState("");
	const [nomeSocial, setNomeSocial] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [dataNascimento, setDataNascimento] = useState(new Date());
	const [mostrarData, setMostrarData] = useState(false);

	useEffect(() => {
		const carregarDados = async () => {
			const dados = await buscarUsuarioPorCPF(cpf);
			if (dados) {
				setNome(dados.nome || "");
				setNomeSocial(dados.nomeSocial || "");
				setEmail(dados.email || "");
				setSenha(dados.senha || "");
				setDataNascimento(new Date(dados.dataNascimento));
			}
		};
		carregarDados();
	}, []);

	const handleAtualizar = async () => {
		await atualizarUsuario(cpf, {
			nome,
			nomeSocial,
			email,
			senha,
			dataNascimento: dataNascimento.toISOString(),
		});
		alert("Dados atualizados com sucesso!");
	};

	const onChangeData = (event: any, selectedDate?: Date) => {
		const currentDate = selectedDate || dataNascimento;
		setMostrarData(Platform.OS === "ios");
		setDataNascimento(currentDate);
	};

	return (
		<View style={{ padding: 20 }}>
			<Text>CPF (não editável)</Text>
			<TextInput value={cpf} editable={false} />

			<Text>Nome</Text>
			<TextInput value={nome} onChangeText={setNome} />

			<Text>Nome Social</Text>
			<TextInput value={nomeSocial} onChangeText={setNomeSocial} />

			<Text>Data de Nascimento</Text>
			<TouchableOpacity onPress={() => setMostrarData(true)}>
				<TextInput value={dataNascimento.toLocaleDateString("pt-BR")} editable={false} />
			</TouchableOpacity>
			{mostrarData && (
				<DateTimePicker
					value={dataNascimento}
					mode="date"
					display="default"
					onChange={onChangeData}
					maximumDate={new Date()}
				/>
			)}

			<Text>Email</Text>
			<TextInput value={email} onChangeText={setEmail} keyboardType="email-address" />

			<Text>Senha</Text>
			<TextInput value={senha} onChangeText={setSenha} secureTextEntry />

			<Button title="Salvar Alterações" onPress={handleAtualizar} />
		</View>
	);
}
