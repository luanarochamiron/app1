import { PessoasDataBase, useUsuarioDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { startTransition, useEffect, useState } from "react";
//mudei issso
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
export default function TelaConfiguracoes() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
    //mudei issso
    const { desativarConta } = useUsuarioDataBase();
 
 
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
//mudei issso
    const confirmarDesativarConta = () => {
        Alert.alert(
            "Desativar Conta",
            "Tem certeza que deseja desativar sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Confirmar",
                    style: "destructive",
                    onPress: async () => {
                        await desativarConta(userId.toString());
                        Alert.alert("Conta desativada", "Sua conta foi desativada com sucesso.");
                        router.push("/"); // volta pra login
                    },
                },
            ]
        );
    };
   
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
 
    useEffect(() => {
        startTransition(async () => {
            setUsuario(await useUsuarioDataBase().findById(userId.toString()));
        });
    }, [userId]);
 
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
                <View style={styles.containerFoto}>
                    <Image
                        source={require("../../assets/images/trotro.png")} // coloque sua imagem aqui
                        style={styles.imagemPerfil}
                    />
                    <Text style={[styles.nome, { fontFamily: "Poppins_600SemiBold" }]}>{usuario?.nomeSocial || usuario?.nome}</Text>
                    <Text style={[styles.email, { fontFamily: "Poppins_400Regular" }]}>{usuario?.email}</Text>
                </View>
 
                <View style={styles.containerCards}>
                    <View style={styles.card1}>
 
                        <TouchableOpacity style={styles.redefinirSenha} onPress={() => router.push({ pathname: "/redefinirSenha", params: { userId , usuarioAtual } })}>
                            <Image source={require("../../assets/images/senhaIcon.png")} style={styles.icon} />
                            <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Redefinir Senha</Text>
                            <Image source={require("../../assets/images/arrow.png")} style={styles.seta2} />
                        </TouchableOpacity>
 
                        <TouchableOpacity style={styles.acessibilidade}>
                            <Image source={require("../../assets/images/acessibilidade.png")} style={styles.icon} />
                            <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Acessibilidade</Text>
                            <Image source={require("../../assets/images/arrow.png")} style={styles.seta2} />
                        </TouchableOpacity>
                    </View>
 
                    <View style={styles.card2}>
                        <TouchableOpacity style={styles.editarPerfil} onPress={() => router.push("/")}>
                            <Image source={require("../../assets/images/SairIcon.png")} style={styles.icon} />
                            <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Sair</Text>
                            <Image source={require("../../assets/images/arrow.png")} style={styles.seta3} />
                        </TouchableOpacity>
 
                        <TouchableOpacity style={styles.acessibilidade} onPress={confirmarDesativarConta}>
                            <Image source={require("../../assets/images/IconLixo.png")} style={styles.icon} />
                            <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Desativar Conta</Text>
                            <Image source={require("../../assets/images/arrow.png")} style={styles.seta4} />
                        </TouchableOpacity>
 
 
                    </View>
 
                    <View style={styles.card3}>
                        <View style={styles.versao}>
                            <Image source={require("../../assets/images/IconVersão.png")} style={styles.icon} />
                            <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Versão</Text>
                            <Text style={styles.numVersao}>1.0.0</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
 
            <View style={styles.menu}>
                <View style={styles.contentMenu}>
                    <TouchableOpacity style={styles.btnHome} onPress={() => router.push({ pathname: "/menu", params: { userId , usuarioAtual } })}>
                        <Image source={require("../../assets/images/Home.png")} style={styles.img2} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnAgenda}
                        onPress={() => router.push({ pathname: "/calendario", params: { userId , usuarioAtual } })}
                    >
                        <Image source={require("../../assets/images/inativo.png")} style={styles.img} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnChat}
                        onPress={() => router.push({ pathname: "/chatListScreen", params: { userId , usuarioAtual } })}
                    >
                        <Image source={require("../../assets/images/Chat.png")} style={styles.img3} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnConfig}
                        onPress={() => router.push({ pathname: "/configuracoes", params: { userId, usuarioAtual  } })}
                    >
                        <Image source={require("../../assets/images/configAtivo.png")} />
                        <View style={styles.linha}></View>
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
 
    scrollContent: {
        paddingBottom: 280,
    },
 
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
 
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
        shadowOffset: {
            width: 0,
            height: -2,
        },
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
    },
 
    img3: {
        width: 45,
        height: 45,
        bottom: 2,
    },
 
    linha: {
        width: 60,
        height: 7,
        backgroundColor: "#5D64F5",
        top: 22,
 
        shadowColor: "#7AB3FF",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 6,
 
        elevation: 10,
        borderRadius: 6,
        zIndex: 1,
    },
 
    containerFoto: {
        alignItems: "center",
        paddingTop: 100,
        flex: 1,
    },
 
    imagemPerfil: {
        width: 170,
        height: 170,
        borderRadius: 120,
        marginBottom: 20,
    },
 
    nome: {
        fontSize: 22,
        fontWeight: "700",
        color: "#3B353FAA",
    },
 
    email: {
        fontSize: 14,
        color: "#AAA",
        marginTop: 4,
    },
 
    containerCards: {
        top: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
 
    card1: {
        width: 309,
        height: 160,
        borderRadius: 18,
        backgroundColor: "rgba(187, 189, 191, 0.2)",
        overflow: "hidden",
    },
 
    card2: {
        top: 35,
        width: 309,
        height: 150,
        borderRadius: 18,
        backgroundColor: "rgba(187, 189, 191, 0.2)",
        overflow: "hidden",
    },
 
    card3: {
        top: 65,
        width: 309,
        height: 75,
        borderRadius: 18,
        backgroundColor: "rgba(187, 189, 191, 0.2)",
        overflow: "hidden",
    },
 
    editarPerfil: {
        width: 309,
        height: 75,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: "hidden",
        paddingHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
 
    redefinirSenha: {
        width: 309,
        height: 75,
        overflow: "hidden",
        paddingHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
 
    acessibilidade: {
        width: 309,
        height: 75,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        overflow: "hidden",
        paddingHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
 
    versao: {
        width: 309,
        height: 75,
        borderRadius: 18,
        overflow: "hidden",
        paddingHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
 
    icon: {
        marginRight: 20,
        width: 25,
        height: 25,
    },
 
    titulo: {
        top: 3,
        fontSize: 18,
        color: "#464747",
    },
 
    seta: {
        left: 80,
    },
 
    seta2: {
        left: 37,
    },
 
    seta3: {
        left: 140,
    },
 
    seta4: {
        left: 47,
    },
 
    numVersao: {
        color: "#98969B",
        left: 110,
    },
});
 