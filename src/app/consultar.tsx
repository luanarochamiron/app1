import { Pessoas } from "@/components/Pessoas";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PessoasDataBase, useUsuarioDataBase } from "../database/useUsuarioDataBase";
 
export default function Cadastrar() {
    const rota = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [pessoas, setPessoas] = useState<PessoasDataBase[]>([]);
    const pessoasDataBase = useUsuarioDataBase();
    const [id, setId] = useState("");
    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [nomeSocial, setNomeSocial] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [busca, setBusca] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
 
    async function list() {
        try {
            const response = await pessoasDataBase.consultar(busca);
            setPessoas(response);
        } catch (error) {
            console.log(error);
        }
    }
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
     
    async function details(item: PessoasDataBase) {
        setId(String(item.id));
        setCpf(item.cpf);
        setNome(item.nome);
        setNomeSocial(item.nomeSocial);
        setDataNascimento(item.dataNascimento);
        setEmail(item.email);
        setSenha(item.senha);
    }
 
    useEffect(() => {
        list();
    }, [busca]);
 
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text>Pessoas cadastradas</Text>
 
                <FlatList
                    data={pessoas}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <Pessoas data={item} />}
                    contentContainerStyle={{ gap: 16 }}
                    scrollEnabled={false} // para evitar conflito de scroll entre ScrollView e FlatList
                />
 
                <TouchableOpacity onPress={() => rota.push({ pathname: "/menu", params: { userId, usuarioAtual } })}>
                    <Text>Voltar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
 
 