import { useCalendarioDataBase } from "@/database/useCalendarioDataBase";
import { PessoasDataBase, useUsuarioDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { startTransition, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
 
export default function TelaMenu() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
    const [todosEventos, setTodosEventos] = useState([]);
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
 
    useEffect(() => {
        startTransition(async () => {
            const usuarioBanco = await useUsuarioDataBase().findById(userId.toString());
            setUsuario(usuarioBanco);
   
            if (!usuarioAtualParam && usuarioBanco) {
                setUsuarioAtual(usuarioBanco.nomeSocial || usuarioBanco.nome);
            }
   
            const { analisar } = useCalendarioDataBase();
            const eventosDoBanco = await analisar("");
            setTodosEventos(eventosDoBanco);
        });
    }, [userId]);
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
   
 
    const contarPrioridades = () => {
        const contagem = { Alta: 0, Média: 0, Baixa: 0 };
 
        todosEventos.forEach((evento) => {
            if (evento.prioridade === "Alta") contagem.Alta++;
            else if (evento.prioridade === "Média") contagem.Média++;
            else if (evento.prioridade === "Baixa") contagem.Baixa++;
        });
 
        return contagem;
    };
 
    const { Alta, Média, Baixa } = contarPrioridades();
 
    const dadosPrioridades = [
        { name: "Alta", population: Alta, color: "#5D64F5" },
        { name: "Média", population: Média, color: "#7B81F5" },
        { name: "Baixa", population: Baixa, color: "#AFB2F5" },
    ].filter(item => item.population > 0); // só exibe quem tem valor maior que 0
 
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D64F5" />
            </View>
        );
    }
 
    const contarTarefasProximas = () => {
    const hoje = new Date();
    const proximas = todosEventos.filter((evento) => {
        if (!evento.data) return false;
        const dataEvento = new Date(evento.data);
        const diffDias = Math.ceil((dataEvento - hoje) / (1000 * 60 * 60 * 24));
        return diffDias >= 0 && diffDias <= 7;
    });
    return proximas.length;
    };
 
    const quantidadeProximas = contarTarefasProximas();
 
    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentBemVindo}>
                    <Image source={require("../../assets/images/trotro.png")} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        <Text style={styles.nome}>Olá, {usuario?.nomeSocial || usuario?.nome}!</Text>
                        <Text style={styles.subtitulo}>Hora de aprender!</Text>
                    </View>
                </View>
 
                <View style={styles.containerSaudeMental}>
                    <View style={styles.cardSaude}>
                        <Image source={require("../../assets/images/cardSaude.png")} style={styles.cardSaude}/>
                        <TouchableOpacity style={styles.btnSaude} onPress={() => router.push({ pathname: "/saudeMental", params: { userId , usuarioAtual} })}>
                            <Text style={[styles.textoBtn, { fontFamily: "Poppins_500Medium" }]}>Começar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
 
                <View style={styles.container}>
                    <Text style={[styles.titulo, { fontFamily: "Poppins_500Medium" }]}>Atalhos</Text>
 
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/pomodoro", params: { userId, usuarioAtual } })}>
                            <Image source={require("../../assets/images/cronometro.png")} style={styles.icon} />
                            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>Método Pomodoro</Text>
                        </TouchableOpacity>
 
                        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/meusSimulados", params: { userId , usuarioAtual} })}>
                            <Image source={require("../../assets/images/simulados.png")} style={styles.icon} />
                            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>Meus Simulados</Text>
                        </TouchableOpacity>
 
                        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/dicasEstudos", params: { userId , usuarioAtual} })}>
                            <Image source={require("../../assets/images/dicasEstudos.png")} style={styles.icon} />
                            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>Dicas de Estudo</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
 
                {/* Resumo das Tarefas */}
                <View style={styles.containerTarefas}>
                    <Text style={[styles.tituloTarefas, { fontFamily: "Poppins_500Medium" }]}>Tarefas</Text>
 
                    <View style={styles.tarefas}>
                        <PieChart
                            data={dadosPrioridades.map(item => ({
                            ...item,
                            legendFontColor: "#444",
                            legendFontSize: 15,
                            }))}
                            width={Dimensions.get("window").width - 40}
                            height={170}
                            chartConfig={{
                            backgroundColor: "#FFF",
                            backgroundGradientFrom: "#FFF",
                            backgroundGradientTo: "#FFF",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            absolute
                            hasLegend={false}
                        />
 
                        {/* Legenda dinâmica */}
                        <View style={styles.legendaContainer}>
                            {dadosPrioridades.map((item, index) => (
                            <View key={index} style={styles.legendaItem}>
                                <View style={[styles.bolinha, { backgroundColor: item.color }]} />
                                <Text style={styles.legendaTexto}>{item.population} {item.name}</Text>
                            </View>
                            ))}
                        </View>
                    </View>
                </View>
 
                <View style={styles.containerProximas}>
                    <Text style={[styles.tituloTarefas, { fontFamily: "Poppins_500Medium" }]}>Tarefas Próximas</Text>
 
                    <View style={styles.cardProximas}>
                        <Text style={styles.textoProximas}>
                        Você tem <Text style={{ color: "#5D64F5", fontWeight: "bold" }}>{quantidadeProximas}</Text> tarefa(s) nos próximos 7 dias!
                        </Text>
                    </View>
                </View>
 
            </ScrollView>
 
            <View style={styles.menu}>
                <View style={styles.contentMenu}>
                    <TouchableOpacity style={styles.btnHome}>
                        <Image source={require("../../assets/images/HomeAtivo.png")} style={styles.img2} />
                        <View style={styles.linha}></View>
                    </TouchableOpacity>
 
                    <TouchableOpacity style={styles.btnAgenda} onPress={() => router.push({ pathname: "/calendario", params: { userId , usuarioAtual} })}>
                        <Image source={require("../../assets/images/inativo.png")} style={styles.img} />
                    </TouchableOpacity>
 
                    <TouchableOpacity style={styles.btnChat} onPress={() => router.push({ pathname: "/chatListScreen", params: { userId, usuarioAtual } })}>
                        <Image source={require("../../assets/images/Chat.png")} style={styles.img3} />
                    </TouchableOpacity>
 
                    <TouchableOpacity style={styles.btnConfig} onPress={() => router.push({ pathname: "/configuracoes", params: { userId , usuarioAtual} })}>
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
 
    scrollContent: {
        paddingBottom: 120,
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
        bottom: 5,
    },
 
    img2: {
        top: 5,
        width: 60,
        height: 60,
    },
 
    img3: {
        width: 45,
        height: 45,
        bottom: 2,
    },
 
    img4: {
        bottom: 2,
    },
 
    linha: {
        width: 60,
        height: 7,
        backgroundColor: "#5D64F5",
        top: 9,
 
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
 
    contentBemVindo: {
        top: 60,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
 
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
 
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
 
    nome: {
        fontSize: 20,
        fontWeight: "600",
        color: "#3E3E3E",
        fontFamily: "Poppins_600SemiBold",
    },
 
    subtitulo: {
        fontSize: 16,
        color: "#9E9E9E",
        fontFamily: "Poppins_400Regular",
    },
 
    containerSaudeMental: {
        top: 100,
        justifyContent: "center",
        alignItems: "center",
    },
 
    cardSaude: {
        zIndex: 2,
        width: 319,
        height: 163,
        backgroundColor: "#9A9EFF",
        borderRadius: 20,
    },
 
    container: {
        marginTop: 140,
        justifyContent: "center",
        alignItems: "center",
        left: 30,
    },
 
    titulo: {
        fontSize: 19,
        fontWeight: "600",
        marginBottom: 15,
        color: "#3B353FAA",
        textAlign: "left",
        alignSelf: "flex-start",
        left: 20,
    },
 
    tituloTarefas: {
        fontSize: 19,
        fontWeight: "600",
        marginBottom: 15,
        color: "#3B353FAA",
        textAlign: "left",
        alignSelf: "flex-start",
        left: 55,
    },
 
    scroll: {
        flexDirection: "row",
        marginRight: 50,
    },
 
    card: {
        width: 100,
        height: 106,
        backgroundColor: "#BBBDBF33",
        borderRadius: 12,
        marginRight: 18,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 10,
    },
 
    icon: {
        top: 10,
        right: 15,
    },
 
    label: {
        fontSize: 12,
        color: "#5D64F5",
        textAlign: "left",
        left: 10,
    },
 
    btnSaude: {
        marginTop: -60,
        left: 40,
        width: 121,
        height: 40,
        backgroundColor: "#fff",
        zIndex: 7,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
 
    textoBtn: {
        textAlign: 'center',
        fontSize: 14,
        color: "#2F348E",
    },
 
    containerTarefas: {
        marginTop: 30,
    },
 
    tarefas: {
        flexDirection: 'row',
        paddingVertical: 10,
        left: 30,
        backgroundColor: '#E7E8E8',
        width: 335,
        borderRadius: 20,
    },
   
    legendaContainer: {
        right: 160,
        marginTop: 37,
        paddingHorizontal: 20,
    },
 
    legendaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
 
    bolinha: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
 
    legendaTexto: {
        fontSize: 14,
        color: "#444",
        fontFamily: "Poppins_400Regular",
    },
 
    containerProximas: {
        marginTop: 20,
        paddingHorizontal: 30,
    },
 
    cardProximas: {
        backgroundColor: "#E7E8E8",
        padding: 15,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
 
    textoProximas: {
        fontSize: 15,
        color: "#3E3E3E",
        fontFamily: "Poppins_400Regular",
    },
});
 
 