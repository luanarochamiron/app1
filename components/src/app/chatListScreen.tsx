import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View,SafeAreaView, ScrollView, Image, ActivityIndicator} from "react-native";
import { useChatDataBase } from "../database/useChatDataBase";
import { useFonts, Poppins_700Bold, Poppins_500Medium, Poppins_600SemiBold, Poppins_400Regular } from "@expo-google-fonts/poppins";
 
export default function ChatListScreen() {
    const router = useRouter();
	const { userId, usuarioAtual } = useLocalSearchParams();
	const [fontsLoaded] = useFonts({
		Poppins_700Bold,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_400Regular,
	});
    const { listarUsuarios } = useChatDataBase();
    const [usuarios, setUsuarios] = useState<string[]>([]);
    const rota = useRouter();
 
    // Normalizar quem tá logado
    const usuarioAtualNormalized = String(usuarioAtual).trim().toLowerCase();
 
    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const resultado = await listarUsuarios();
                setUsuarios(resultado.filter((u) => u !== usuarioAtualNormalized)); // Ocultar você mesmo da lista
            } catch (error) {
                console.log("Erro ao carregar usuários:", error);
            }
        }
 
        carregarUsuarios();
    }, []);
 
    const abrirChat = (contato: string) => {
        rota.push({
            pathname: "/chatScreen",
            params: { contato, usuarioAtual },
        });
    };
 
    if (!fontsLoaded) {
		// Mostra carregamento enquanto a fonte não estiver pronta
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
                    <Text style={styles.title}>Conversas</Text>

                    {usuarios.map(({ email, nome, nomeSocial }) => {
                        const nomeExibido = nomeSocial && nomeSocial.trim() !== "" ? nomeSocial : nome;
                        const primeiraLetra = nomeExibido && nomeExibido.length > 0 ? nomeExibido[0].toUpperCase() : "?";

                        return (
                            <TouchableOpacity
                            key={email}
                            style={styles.chatCard}
                            onPress={() => abrirChat(email)}
                            >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{primeiraLetra}</Text>
                            </View>

                            <View style={styles.chatInfo}>
                                <Text style={styles.chatName}>{nomeExibido}</Text>
                                {/* <Text style={styles.chatPreview}>Toque para conversar</Text>*/}
                            </View>

                            <Image
                                source={require("../../assets/images/arrow.png")}
                                style={{ width: 20, height: 20, tintColor: "#bbb" }}
                            />
                            </TouchableOpacity>
                        );
                    })}


                </View>
            </ScrollView>

            <View style={styles.menu}>
				<View style={styles.contentMenu}>
					<TouchableOpacity style={styles.btnHome} onPress={() => rota.push({ pathname: "/menu", params: { userId } })}>
						<Image source={require("../../assets/images/Home.png")} style={styles.img2} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btnAgenda}
						onPress={() => rota.push({ pathname: "/calendario", params: { userId } })}
					>
						<Image source={require("../../assets/images/inativo.png")} style={styles.img} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btnChat}
						onPress={() => rota.push({ pathname: "/chatListScreen", params: { userId } })}
					>
						<Image source={require("../../assets/images/ChatAtivo.png")} style={styles.img3} />
                        <View style={styles.linha}></View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btnConfig}
						onPress={() => rota.push({ pathname: "/configuracoes", params: { userId } })}
					>
						<Image source={require("../../assets/images/Configurações.png")} style={styles.img4} />
					</TouchableOpacity>
				</View>
			</View>
        </SafeAreaView>
       

    );
}
 
const styles = StyleSheet.create({
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

		//Sombra para iOS
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -2, // sombra acima
		},
		shadowOpacity: 0.2, // 20% opacidade
		shadowRadius: 20, // blur de 20

		// Sombra para Android
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
        bottom: 5
	},

	img2: {
		width: 35,
		height: 35,
        bottom: 2
	},

	img3: {
		width: 45,
		height: 45,
        top: 2
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

		// iOS: sombra personalizada
		shadowColor: "#7AB3FF",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 1,
		shadowRadius: 6,

		// Android: precisa de elevation
		elevation: 10, // aumente para intensificar
		borderRadius: 6, // sombras aparecem melhor com bordas arredondadas
		zIndex: 1, // força renderização acima de outros
	},

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

    container: { flex: 1},
    title: {
        fontSize: 28,
        fontFamily: "Poppins_600semiBold",
        marginBottom: 24,
        textAlign: "center",
        color: "#333",
    },

    chatCard: {
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        /*borderRadius: 12, */
        padding: 25,
        /*marginBottom: 12,*/
        /*shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,*/
    },
    avatar: {
        left: 5,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#d1c4e9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4A148C",
        fontFamily: "Poppins_600SemiBold",
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        left: 10,
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
    voltarButton: {
        backgroundColor: "#5D64F5",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        marginTop: 20,
        alignSelf: "center",
    },
    voltarButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
    },
});
 