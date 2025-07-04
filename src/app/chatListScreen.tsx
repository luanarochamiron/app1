import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	useFonts,
} from "@expo-google-fonts/poppins";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useChatDataBase } from "../database/useChatDataBase";
 
export default function ChatListScreen() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const usuarioAtual =
        usuarioAtualParam === "undefined" || usuarioAtualParam === undefined
            ? undefined
            : usuarioAtualParam;
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
    const { listarUsuariosComResumo } = useChatDataBase();
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const rota = useRouter();
 
    const usuarioAtualNormalized = String(usuarioAtual).trim().toLowerCase();
 
 
    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const resultado = await listarUsuariosComResumo(usuarioAtualNormalized);
                setUsuarios(resultado);
            } catch (error) {
                console.log("Erro ao carregar usuários:", error);
            }
        }
 
        carregarUsuarios();
    }, []);
 
    const abrirChat = (contato: string) => {
        rota.push({
            pathname: "/chatScreen",
            params: { contato, usuarioAtual ,userId},
        });
    };
 
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D64F5" />
            </View>
        );
    }
 
    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.title}>Mensagens</Text>
 
                    {usuarios.map((user) => {
                        const nomeExibido =
                            user.nomeSocial && user.nomeSocial.trim() !== "" ? user.nomeSocial : user.nome;
                        const primeiraLetra = nomeExibido?.[0]?.toUpperCase() || "?";
 
                        return (
                            <TouchableOpacity
                                key={user.email}
                                style={styles.chatCard}
                                onPress={() => abrirChat(user.email)}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{primeiraLetra}</Text>
                                </View>
 
                                <View style={styles.chatInfo}>
                                    <View style={styles.chatRow}>
                                        <Text style={styles.chatName}>{nomeExibido}</Text>
                                        <Text style={styles.chatTime}>{user.horario}</Text>
                                    </View>
 
                                    <View style={styles.chatRow}>
                                        <Text numberOfLines={1} style={styles.chatPreview}>
                                            {user.ultimaMensagem || "Toque para conversar"}
                                        </Text>
 
                                        {user.naoLidas > 0 && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{user.naoLidas}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
 
            {/* MENU INFERIOR */}
            <View style={styles.menu}>
                <View style={styles.contentMenu}>
                    <TouchableOpacity
                        style={styles.btnHome}
                        onPress={() => rota.push({ pathname: "/menu", params: { userId,usuarioAtual  } })}
                    >
                        <Image source={require("../../assets/images/Home.png")} style={styles.img2} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnAgenda}
                        onPress={() => rota.push({ pathname: "/calendario", params: { userId ,usuarioAtual } })}
                    >
                        <Image source={require("../../assets/images/inativo.png")} style={styles.img} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnChat}
                        onPress={() => rota.push({ pathname: "/chatListScreen", params: { userId ,usuarioAtual } })}
                    >
                        <Image source={require("../../assets/images/ChatAtivo.png")} style={styles.img3} />
                        <View style={styles.linha}></View>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnConfig}
                        onPress={() => rota.push({ pathname: "/configuracoes", params: { userId,usuarioAtual  } })}
                    >
                        <Image source={require("../../assets/images/Configurações.png")} style={styles.img4} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
 
const styles = StyleSheet.create({
      tela: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    container: {
        flex: 1,
    },
    title: {
        top: 20,
        fontSize: 28,
        fontFamily: "Poppins_600SemiBold",
        marginBottom: 40,
        textAlign: "center",
        color: "#6D73F5",
    },
    chatCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#e0e7ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        color: "#4f46e5",
        fontFamily: "Poppins_600SemiBold",
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 17,
        fontFamily: "Poppins_600SemiBold",
        color: "#333",
    },
    chatPreview: {
        fontSize: 14,
        color: "#999",
        fontFamily: "Poppins_400Regular",
        marginTop: 2,
    },
 
    // MENU DE NAVEGAÇÃO
    menu: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        width: "92%",
        height: 82,
        backgroundColor: "#fff",
        borderRadius: 200,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    contentMenu: {
        flexDirection: "row",
        paddingRight: 20,
        paddingLeft: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    btnHome: {
        justifyContent: "center",
        alignItems: "center",
        width: 72,
        height: 82,
        backgroundColor: "#fff",
    },
    btnAgenda: {
        justifyContent: "center",
        alignItems: "center",
        width: 72,
        height: 82,
        backgroundColor: "#fff",
    },
    btnChat: {
        justifyContent: "center",
        alignItems: "center",
        width: 72,
        height: 82,
        backgroundColor: "#fff",
    },
    btnConfig: {
        justifyContent: "center",
        alignItems: "center",
        width: 72,
        height: 82,
        backgroundColor: "#fff",
    },
    img: {
        width: 80,
        height: 72,
        bottom: 5,
    },
    img2: {
        width: 35,
        height: 35,
        bottom: 2,
    },
    img3: {
        width: 45,
        height: 45,
        top: 2,
    },
    img4: {
        bottom: 2,
    },
    linha: {
        left: 1,
        width: 60,
        height: 7,
        backgroundColor: "#5D64F5",
        top: 15,
        shadowColor: "#7AB3FF",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 10,
        borderRadius: 6,
        zIndex: 1,
    },
    rightInfo: {
        alignItems: "flex-end",
    },
    time: {
        fontSize: 12,
        color: "#aaa",
        fontFamily: "Poppins_400Regular",
        marginBottom: 6,
    },
    chatRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
 
    chatTime: {
        fontSize: 12,
        color: "#999",
        fontFamily: "Poppins_400Regular",
    },
 
    badge: {
        backgroundColor: "#5D64F5",
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
        marginLeft: 10,
    },
 
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
 
 