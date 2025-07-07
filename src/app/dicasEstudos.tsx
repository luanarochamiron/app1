import { PessoasDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";
 
export default function TelaDicaEstudos() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
 
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
                    <BotaoVoltar titulo="Dicas de Estudo" onPress={() => router.push({ pathname: "/menu", params: { userId , usuarioAtual} })} />
                </View>
 
                <View style={styles.containerMaterias}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                        {["Linguagens", "Matemática", "Humanas", "Natureza"].map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.cardMaterias, item === "Linguagens" && styles.cardAtivo]}
                                onPress={() => {
                                    if (item === "Matemática") {
                                        router.push({ pathname: "/dicasdeEstudosMatematica", params: { userId, usuarioAtual } });
                                    } else if (item === "Linguagens") {
                                        router.push({ pathname: "/dicasEstudos", params: { userId } });
                                    } else if (item === "Natureza") {
                                        router.push({ pathname: "/dicasdeEstudosNatureza", params: { userId, usuarioAtual } });
                                    } else if (item === "Humanas") {
                                        router.push({ pathname: "/dicasdeEstudosHumanas", params: { userId, usuarioAtual } });
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
                        <Text style={styles.cardTitulo}>Estudar é Liberdade!</Text>
                        <Text style={styles.cardDescricao}>
                            Invista em você, porque o conhecimento é o único bem que ninguém pode tirar.
                        </Text>
                    </View>
                </View>
 
                <View style={styles.containerCard}>
                    <TouchableOpacity
                        style={styles.cardsItem}
                        onPress={() => router.push({ pathname: "/dicasRedacao", params: { userId , usuarioAtual} })}
                    >
                        <View style={styles.cardContentItem}>
                            <AntDesign name="edit" size={24} color="#5D64F5" style={styles.icon} />
                            <Text style={styles.cardTextoItem}>Redação</Text>
                        </View>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.cardsItem}
                        onPress={() => router.push({ pathname: "/dicasInterpretacao", params: { userId, usuarioAtual } })}
                    >
                        <View style={styles.cardContentItem}>
                            <FontAwesome5 name="book" size={24} color="#5D64F5" style={styles.icon} />
                            <Text style={styles.cardTextoItem}>Interpretação</Text>
                        </View>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.cardsItem}
                        onPress={() => router.push({ pathname: "/dicasLiteratura", params: { userId , usuarioAtual} })}
                    >
                        <View style={styles.cardContentItem}>
                            <AntDesign name="book" size={24} color="#5D64F5" style={styles.icon} />
                            <Text style={styles.cardTextoItem}>Literatura</Text>
                        </View>
                    </TouchableOpacity>
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
    },
 
    cardImagem: {
        width: 320,
        height: 160,
        backgroundColor: "#C5C8EF", // tom lilás claro fiel à imagem
        borderRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 24,
        position: "relative",
      },
     
      cardTitulo: {
        top: 10,
        marginRight: -70,
        fontSize: 23,
        fontWeight: "bold",
        color: "#7077F4", // cor do título exata da imagem
        fontFamily: "Poppins_700Bold",
        marginBottom: 8,
      },
     
      cardDescricao: {
        top: 15,
        fontSize: 13,
        color: "#565768",
        lineHeight: 20,
        fontFamily: "Poppins_400Regular",
        maxWidth: 270,
        left: 3,
      },
     
 
    cardMateria: {
        backgroundColor: "#D6D7FF",
        width: 320,
        height: 100,
        borderRadius: 20,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
 
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
 
    cardTexto: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: "#333",
    },
 
    cardsItem: {
        width: 318,
        height: 86,
        borderRadius: 18,
        backgroundColor: "#fff",
        justifyContent: "center",
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        borderWidth: 0.5,
        borderColor: "#E0E4EB",
    },
 
    cardContentItem: {
        flexDirection: "row",
        alignItems: "center",
    },
 
    cardTextoItem: {
        fontSize: 18,
        marginLeft: 12,
        fontFamily: "Poppins_600SemiBold",
        color: "#3A3A3A",
    },
 
    icon: {
        marginRight: 8,
    },
});
 
 