import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	useFonts,
} from "@expo-google-fonts/poppins";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Alert,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";
import { useCalendarioDataBase } from "../database/useCalendarioDataBase";
 
 
export default function EditarEvento() {
    const router = useRouter();
    const { userId,id, titulo, descricao, prioridade,data, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const { alterar } = useCalendarioDataBase();
 
    const [novoTitulo, setNovoTitulo] = useState(titulo);
    const [novaDescricao, setNovaDescricao] = useState(descricao);
    const [novaPrioridade, setNovaPrioridade] = useState(prioridade);
 
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_400Regular,
    });
 
    const dataFormatada = format(new Date(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
 
    const salvarAlteracoes = async () => {
        if (novoTitulo.trim() === "") {
            Alert.alert("Erro", "O título não pode estar vazio.");
            return;
        }
 
        try {
            await alterar({
                id,
                titulo: novoTitulo.trim(),
                descricao: novaDescricao.trim(),
                prioridade: novaPrioridade,
                data,
            });
 
            Alert.alert("Sucesso", "Tarefa atualizada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.push({ pathname: "/calendario", params: { userId } }),
                },
            ]);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
        }
    };
 
    if (!fontsLoaded) return null;
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
 
    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView  contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View>
                    <BotaoVoltar titulo="Editar Tarefa" onPress={() => router.push({ pathname: "/calendario", params: { userId } })} />
                </View>
 
                <View style={styles.containerTela}>
                    <View style={styles.dataCard}>
                        <Text style={styles.dataText}>{dataFormatada}</Text>
                    </View>
 
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
                            value={novoTitulo}
                            onChangeText={setNovoTitulo}
                        />
 
                        <TextInput
                            style={[styles.inputDescricao, { fontFamily: "Poppins_500Medium" }]}
                            value={novaDescricao}
                            onChangeText={setNovaDescricao}
                            multiline
   
                        />
                        <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>Prioridade</Text>
                        <View style={styles.radioGroup}>
                            {["Alta", "Média", "Baixa"].map((nivel) => (
                                <TouchableOpacity
                                key={nivel}
                                style={[
                                    styles.radioButton,
                                    novaPrioridade === nivel && styles.radioButtonSelected
                                ]}
                                onPress={() => setNovaPrioridade(nivel)}
                                >
                                <Text
                                    style={[
                                    styles.radioText,
                                    novaPrioridade === nivel && styles.radioTextSelected
                                    ]}
                                >
                                    {nivel}
                                </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
                            <Text style={styles.buttonText}>Salvar Alterações</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
 
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECEEFF",
    },
 
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
 
    tela: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
 
    containerTela: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 10,
    },
 
    dataCard: {
        marginTop: 140,
        backgroundColor: "rgba(93, 100, 245, 0.44)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        width: 290,
        height: 50,
    },
 
    dataText: {
        textAlign: 'center',
        color: "#5D64F5",
        fontSize: 16,
        top:2,
        fontFamily: "Poppins_500Medium",
    },
 
    formContainer: {
        top: 45,
    },
 
    input: {
        height: 59,
        width: 300,
        borderWidth: 2,
        borderColor: "#5A50FF",
        borderRadius: 15,
        paddingLeft: 32,
        paddingRight: 12,
        alignSelf: "center",
        color: "rgba(9, 9, 9, 0.66)",
        fontSize: 15,
        backgroundColor: "#f5f5f5",
        textAlignVertical: "center",
        marginBottom: 30,
    },
 
    inputDescricao: {
        height: 90,
        width: 300,
        borderWidth: 2,
        borderColor: "#5A50FF",
        borderRadius: 15,
        paddingLeft: 32,
        paddingRight: 12,
        alignSelf: "center",
        color: "rgba(9, 9, 9, 0.66)",
        fontSize: 15,
        backgroundColor: "#f5f5f5",
        textAlignVertical: "center",
        marginBottom: 30,
    },
 
    label: {
        left: 10,
        top: 10,
        fontSize: 15,
        color: "#3B353FAA",
    },
 
    radioGroup: {
        top: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
   
    radioButton: {
        flex: 1,
        paddingVertical: 14,
        marginHorizontal: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F3F4F6",
        alignItems: "center",
    },
   
    radioButtonSelected: {
        backgroundColor: "#5D64F5",
        borderColor: "#5D64F5",
    },
   
    radioText: {
        color: "#374151",
        fontFamily: "Poppins_500Medium",
        fontSize: 15,
    },
   
    radioTextSelected: {
        color: "#fff",
        fontFamily: "Poppins_600SemiBold",
    },
 
    button: {
        top: 50,
        backgroundColor: "#5D64F5",
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
        shadowColor: "#5D64F5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
 
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        letterSpacing: 0.5,
    },
 
});
 
 