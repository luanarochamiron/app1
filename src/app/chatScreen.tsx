import { Ionicons } from "@expo/vector-icons"; // ícone opcional
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ChatMessage, useChatDataBase } from "../database/useChatDataBase";
export default function ChatScreen() {
    const { buscarMensagens, enviarMensagem } = useChatDataBase();
    const rota = useRouter();
    const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [menuVisivel, setMenuVisivel] = useState(false);

    // Pegando os parâmetros da URL
    const { contato, usuarioAtual, userId, nomeContato, nomeSocialContato } = useLocalSearchParams();
 
    // Normalizando pra evitar bugs de espaços ou letras maiúsculas
 
    const usuarioAtualFormatado = String(usuarioAtual).trim().toLowerCase();
    const contatoFormatado = String(contato).trim().toLowerCase();
    const nomeExibido = nomeSocialContato?.trim() || nomeContato?.trim() || contatoFormatado;
    const primeiraLetra = nomeExibido[0]?.toUpperCase() || "?";

    // Carregar mensagens ao abrir a tela
    useEffect(() => {
        carregarMensagens();
    }, [usuarioAtualFormatado, contatoFormatado
    ]);
 
    // Buscar mensagens entre o usuário atual e o contato
    async function carregarMensagens() {
        const resultado = await buscarMensagens(usuarioAtualFormatado, contatoFormatado);
     
        const mensagensFormatadas = resultado
          .map((msg: any) => {
            let dataObj: Date;
     
            // se é timestamp do Firestore
            if (msg.datahora && typeof msg.datahora === "object" && typeof msg.datahora.toDate === "function") {
              dataObj = msg.datahora.toDate();
            }
            // se é string ISO ou outro formato válido
            else if (msg.datahora && typeof msg.datahora === "string") {
              dataObj = new Date(msg.datahora);
            }
            // se é number (timestamp em milissegundos)
            else if (typeof msg.datahora === "number") {
              dataObj = new Date(msg.datahora);
            }
            // fallback, coloca a data atual pra evitar 1970
            else {
              dataObj = new Date();
            }
     
            return {
              ...msg,
              dataHora: dataObj,
            };
          })
          .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())
          .map((msg) => ({
            ...msg,
            dataHora: msg.dataHora.toLocaleString(),
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
            <View style={styles.containerTopo}>
                <TouchableOpacity
                    onPress={() => rota.push({ pathname: "/chatListScreen", params: { userId } })}
                    style={{ padding: 6 }}
                >
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.contatoInfo}>
                    <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{primeiraLetra}</Text>
                    </View>
                    <Text style={styles.nomeContato}>{nomeExibido}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => setMenuVisivel(!menuVisivel)}
                    style={{ position: "absolute", right: 30 }}
                    >
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>

            </View>

            {menuVisivel && (
                <View style={styles.menuDropdown}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={carregarMensagens}>
                    <Text style={styles.dropdownItemText}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            )}
 
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
                    placeholderTextColor="#999"
                    value={novaMensagem}
                    onChangeText={setNovaMensagem}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleEnviar}
                    disabled={novaMensagem.trim() === ""}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
 
        </View>
    );
}
 
const styles = StyleSheet.create({
    containerTopo: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#7364f5",
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: 400,
        right: 10,
    },
    
    contatoInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#dbeafe", // Azul claro (moderno)
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    
    avatarText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7364f5", // Azul profissional
    },
    
    nomeContato: {
        fontSize: 21,
        color: "#fff",
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    
    container: { flex: 1, backgroundColor: "#f3f3f3", padding: 10 },

    titulo: { fontSize: 20, marginBottom: 10, textAlign: "center" },

    lista: { flex: 1, top: 30, right: 10},

    mensagem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        maxWidth: "80%",
    },

    mensagemEnviada: {
        alignSelf: "flex-end",
        backgroundColor: "#B8BBFF",
    },

    mensagemRecebida: {
        alignSelf: "flex-start",
        backgroundColor: "#CCCEF6",
    },

    textoMensagem: { fontSize: 16 },

    textoData: { fontSize: 12, color: "#555", marginTop: 5 },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 30,
        paddingHorizontal: 10,
        borderTopWidth: 2,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        width: 390,
        right: 7,
        top: 34,
    },
      
    input: {
        flex: 1,
        backgroundColor: "#DEDFFF",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 15,
        marginRight: 8,
        color: "#333",
        borderWidth: 1,
        borderColor: "#ddd",
    },
      
    sendButton: {
        backgroundColor: "#7364f5", // mesma cor do topo
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
      },
    atualizarButton: {
        backgroundColor: "#000",
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

    menuDropdown: {
        position: "absolute",
        top: 60, // um pouco abaixo do botão
        right: 30, // mesmo alinhamento do botão
        backgroundColor: "#fff",
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 6,
        zIndex: 100, // garantir que fique acima de tudo
      },
      
      dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      
      dropdownItemText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "500",
      },
      
      
});
 
 