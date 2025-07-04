import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Linking,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";
 
import { Entypo } from "@expo/vector-icons";
 
export default function TelaSimulados() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
            setUsuarioAtual(undefined);
        } else {
            setUsuarioAtual(usuarioAtualParam);
        }
    }, [usuarioAtualParam]);
 
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
                <View style={styles.content}>
                    <BotaoVoltar titulo="Simulados" onPress={() => router.push({ pathname: "/menu", params: { userId, usuarioAtual } })} />
                </View>
 
                <View style={styles.containerMaterias}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                        {["Enem", "Fuvest", "Unesp"].map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.cardMaterias, item === "Enem" && styles.cardAtivo]}
                                onPress={() => {
                                    if (item === "Fuvest") {
                                        router.push({ pathname: "/simuladosFuvest", params: { userId, usuarioAtual } });
                                    } else if (item === "Unesp") {
                                        router.push({ pathname: "/simuladosUnesp", params: { userId, usuarioAtual } });
                                    }
                                }}
                            >
                                <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
 
                <View style={styles.containerCardImagem}>
                    <View style={styles.cardImagem}>
                        <Text style={[styles.textoCard, { fontFamily: "Poppins_600SemiBold" }]}>Enem 2024</Text>
                        <Text style={[styles.descricao, { fontFamily: "Poppins_400Regular" }]}>
                            Teste seus conhecimentos com um simulado baseado na edição de 2024.
                        </Text>
                        <View style={styles.parteBranca}>
                            <TouchableOpacity
                                style={styles.btnEstatiscas}
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf")
                                }
                            >
                                <Entypo name="bar-graph" size={24} color="#5D64F5" />
                            </TouchableOpacity>
 
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf")
                                }
                                style={styles.btn}
                            >
                                <Text style={[styles.textoBtn, { fontFamily: "Poppins_600SemiBold" }]}>Treinar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
 
                    <View style={styles.cardImagem}>
                        <Text style={[styles.textoCard, { fontFamily: "Poppins_600SemiBold" }]}>Enem 2023</Text>
                        <Text style={[styles.descricao, { fontFamily: "Poppins_400Regular" }]}>
                            Teste seus conhecimentos com um simulado baseado na edição de 2023.
                        </Text>
                        <View style={styles.parteBranca}>
                            <TouchableOpacity
                                style={styles.btnEstatiscas}
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD2.pdf")
                                }
                            >
                                <Entypo name="bar-graph" size={24} color="#5D64F5" />
                            </TouchableOpacity>
 
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD2.pdf")
                                }
                            >
                                <Text style={[styles.textoBtn, { fontFamily: "Poppins_600SemiBold" }]}>Treinar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
 
                    <View style={styles.cardImagem}>
                        <Text style={[styles.textoCard, { fontFamily: "Poppins_600SemiBold" }]}>Enem 2022</Text>
                        <Text style={[styles.descricao, { fontFamily: "Poppins_400Regular" }]}>
                            Teste seus conhecimentos com um simulado baseado na edição de 2022.
                        </Text>
                        <View style={styles.parteBranca}>
                            <TouchableOpacity
                                style={styles.btnEstatiscas}
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf")
                                }
                            >
                                <Entypo name="bar-graph" size={24} color="#5D64F5" />
                            </TouchableOpacity>
 
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() =>
                                    Linking.openURL("https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3.pdf")
                                }
                            >
                                <Text style={[styles.textoBtn, { fontFamily: "Poppins_600SemiBold" }]}>Treinar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
 
const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
 
    content: {
        left: 10,
        top: 10,
        paddingHorizontal: 32,
    },
 
    scrollContent: {
        paddingBottom: 100,
    },
 
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
 
    containerMaterias: {
        marginTop: 120,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
 
    scroll: {
        flexDirection: "row",
    },
 
    cardMaterias: {
        minWidth: 166,
        height: 53,
        borderRadius: 10,
        backgroundColor: "#DDDEF3",
        marginRight: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
 
    cardAtivo: {
        backgroundColor: "#D6D7FF",
        borderColor: "#5D64F5",
        borderWidth: 1,
    },
 
    label: {
        fontSize: 17,
        color: "#5D64F5",
    },
 
    containerCard: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 110,
        gap: 20,
    },
 
    containerCardImagem: {
        top: 55,
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
    },
 
    cardImagem: {
        width: 320,
        height: 220,
        borderRadius: 18,
        backgroundColor: "#DDDEF3",
        justifyContent: "center",
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        borderWidth: 1,
        borderColor: "#5D64F5",
    },
 
    textoCard: {
        textAlign: "left",
        marginTop: -100,
        fontSize: 22,
        color: "#5E5E5E",
    },
 
    descricao: {
        top: 10,
        color: "#5E5E5E",
    },
 
    parteBranca: {
        width: 320,
        height: 80,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#5D64F5",
 
        flexDirection: "row",
        alignItems: "center",
    },
 
    btn: {
        left: 90,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#5D64F5",
        justifyContent: "center",
        alignItems: "center",
    },
 
    btnNota: {
        left: 10,
        borderRadius: 30,
        width: 70,
        height: 30,
        backgroundColor: "#B1B4F4",
    },
 
    btnEstatiscas: {
        left: 30,
        width: 50,
        height: 40,
        backgroundColor: "#9A9EFF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
 
    textoBtn: {
        color: "#fff",
        textAlign: "center",
    },
});
 
 