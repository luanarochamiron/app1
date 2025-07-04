

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ChatMessage, useChatDataBase } from "../database/useChatDataBase";
 
export default function ChatScreen() {
    const { buscarMensagens, enviarMensagem } = useChatDataBase();
    const rota = useRouter();
    const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
    const [novaMensagem, setNovaMensagem] = useState("");
 
    // Pegando os parâmetros da URL
    const { contato, usuarioAtual } = useLocalSearchParams();
 
    // Normalizando pra evitar bugs de espaços ou letras maiúsculas
    const usuarioAtualFormatado = String(usuarioAtual).trim().toLowerCase();
    const contatoFormatado = String(contato).trim().toLowerCase();
 
    // Carregar mensagens ao abrir a tela
    useEffect(() => {
        carregarMensagens();
    }, []);
 
    // Buscar mensagens entre o usuário atual e o contato
    async function carregarMensagens() {
        const resultado = await buscarMensagens(usuarioAtualFormatado, contatoFormatado);
 
        // Formatar a data pra exibir bonitinho
        const mensagensFormatadas = resultado.map((msg: any) => ({
            ...msg,
            dataHora: msg.datahora?.toDate?.().toLocaleString() || "",
        }));
 
        setMensagens(mensagensFormatadas);
    }
 
    // Enviar mensagem
    async function handleEnviar() {
        if (novaMensagem.trim() === "") return;
 
        const novaMsg = {
            remetente: usuarioAtualFormatado,
            destinatario: contatoFormatado,
            mensagem: novaMensagem.trim(),
            dataHora: new Date().toISOString(),
        };
 
        await enviarMensagem(novaMsg);
        setNovaMensagem("");
        carregarMensagens();
    }
 
    // Renderizar cada item da lista de mensagens
    const renderItem = ({ item }: { item: ChatMessage }) => (
        <View
            style={[
                styles.mensagem,
                item.remetente?.trim().toLowerCase() === usuarioAtualFormatado
                    ? styles.mensagemEnviada
                    : styles.mensagemRecebida,
            ]}
        >
            <Text style={styles.textoMensagem}>{item.mensagem}</Text>
            <Text style={styles.textoData}>{item.dataHora}</Text>
        </View>
    );
 
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Conversando com: {contatoFormatado}</Text>
 
            <FlatList
                data={mensagens}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.lista}
            />
 
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChangeText={setNovaMensagem}
                />
                <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
                    <Text style={styles.botaoTexto}>Enviar</Text>
                </TouchableOpacity>
            </View>
 
            <TouchableOpacity style={styles.atualizarButton} onPress={carregarMensagens}>
                <Text style={styles.atualizarButtonText}>Atualizar</Text>
                </TouchableOpacity>
 
 
            <TouchableOpacity style={styles.voltarButton} onPress={() => rota.back()}>
                <Text style={styles.voltarButtonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 10 },
    titulo: { fontSize: 20, marginBottom: 10, textAlign: "center" },
    lista: { flex: 1 },
    mensagem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        maxWidth: "80%",
    },
    mensagemEnviada: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
    },
    mensagemRecebida: {
        alignSelf: "flex-start",
        backgroundColor: "#E5E5EA",
    },
    textoMensagem: { fontSize: 16 },
    textoData: { fontSize: 12, color: "#555", marginTop: 5 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    botao: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    botaoTexto: {
        color: "#fff",
        fontWeight: "bold",
    },
    voltarButton: {
        backgroundColor: "#888",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignSelf: "center",
    },
    voltarButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    atualizarButton: {
        backgroundColor: "#5D64F5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: "center",
      },
     
      atualizarButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
     
});
 
 