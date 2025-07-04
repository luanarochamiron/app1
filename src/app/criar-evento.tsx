import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	useFonts,
} from "@expo-google-fonts/poppins";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
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
 
export default function CriarEventoScreen() {
    const { userId,dataSelecionada, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [selectedDate, setSelectedDate] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const { criar } = useCalendarioDataBase();
    const rota = useRouter();
 
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
 
    useEffect(() => {
        if (dataSelecionada) {
            setSelectedDate(dataSelecionada);
        }
    }, [dataSelecionada]);
 
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D64F5" />
            </View>
        );
    }
 
    const salvarEvento = async () => {
        if (!selectedDate || titulo.trim() === "") {
            Alert.alert("Erro", "Selecione uma data e preencha o título");
            return;
        }
 
        try {
            await criar({
                data: selectedDate,
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                prioridade: prioridade.trim(),
            });
            Alert.alert("Sucesso", "Tarefa criado com sucesso!");
            rota.push({ pathname: "/calendario", params: { userId , usuarioAtual} });
        } catch (error) {
            console.log("Erro ao criar tarefa:", error);
            Alert.alert("Erro", "Não foi possível criar a tarefa.");
        }
    };
 
    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView  contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View>
                    <BotaoVoltar titulo="Adicionar Tarefa" onPress={() => rota.push({ pathname: "/calendario", params: { userId , usuarioAtual} })} />
                </View>
                <View style={styles.containerTela}>
                    {selectedDate && (
                        <View style={styles.dataCard}>
                            <Text style={styles.dataText}>
                                {format(parseISO(selectedDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </Text>
                        </View>
                    )}
 
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
                            placeholder="Título:"
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                        <TextInput
                            style={[styles.input, { fontFamily: "Poppins_500Medium" }]}
                            placeholder="Descrição:"
                            value={descricao}
                            onChangeText={setDescricao}
                        />
                        <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>Prioridade</Text>
                        <View style={styles.radioGroup}>
                            {["Alta", "Média", "Baixa"].map((nivel) => (
                                <TouchableOpacity
                                    key={nivel}
                                    style={[
                                        styles.radioButton,
                                        prioridade === nivel && styles.radioButtonSelected
                                    ]}
                                    onPress={() => setPrioridade(nivel)}
                                >
                                    <Text
                                        style={[
                                            styles.radioText,
                                            prioridade === nivel && styles.radioTextSelected
                                        ]}
                                    >
                                        {nivel}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
 
                        <TouchableOpacity style={styles.addButton} onPress={salvarEvento}>
                            <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
                        </TouchableOpacity>
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
 
    selected: {
        textAlign: "center",
        color: "#5D64F5",
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        marginBottom: 12,
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
 
    addButton: {
        top: 70,
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
 
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        letterSpacing: 0.5,
    },
 
    button: {
        backgroundColor: "#5A50FF",
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 12,
        marginVertical: 30,
        alignItems: "center",
        alignSelf: "center",
    },
 
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
    },
});
 
 