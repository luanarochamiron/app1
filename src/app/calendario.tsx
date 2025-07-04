import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Feather } from '@expo/vector-icons';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useCalendarioDataBase } from "../database/useCalendarioDataBase";
 
 
export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState("");
    const [events, setEvents] = useState({});
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [markedDates, setMarkedDates] = useState({});
    const [editandoEvento, setEditandoEvento] = useState(null); // controle de edição
    const rota = useRouter();
    const [modalVisivelId, setModalVisivelId] = useState(null);
    const [botaoFixado, setBotaoFixado] = useState(false);
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [todosEventos, setTodosEventos] = useState([]);
    const today = format(new Date(), 'yyyy-MM-dd');
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
      });
    const { criar, analisar, alterar, apagar } = useCalendarioDataBase();
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
 
    const getCorPrioridade = (prioridade) => {
        switch (prioridade) {
            case "Alta":
            return "#FF4C4C"; // vermelho
            case "Média":
            return "#FFC107"; // amarelo
            case "Baixa":
            return "#4CAF50"; // verde
            default:
            return "#ccc";
        }
    };
 
    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
          const next = addMonths(prevDate, 1);
          return new Date(next.getFullYear(), next.getMonth(), 1);
        });
      };
     
      const handlePrevMonth = () => {
        setCurrentDate(prevDate => {
          const prev = subMonths(prevDate, 1);
          return new Date(prev.getFullYear(), prev.getMonth(), 1);
        });
      };  
 
    const carregarDatasMarcadas = async () => {
        try {
            const eventosDoBanco = await analisar("");
            const novasDatasMarcadas = {};
   
            eventosDoBanco.forEach((evento) => {
                let corDot = "#00adf5";
   
                if (evento.prioridade === "Alta") corDot = "#FF0000";
                else if (evento.prioridade === "Média") corDot = "#FFD700";
                else if (evento.prioridade === "Baixa") corDot = "#008000";
   
                if (novasDatasMarcadas[evento.data]) {
                    if (!Array.isArray(novasDatasMarcadas[evento.data].dots)) {
                        novasDatasMarcadas[evento.data].dots = [];
                    }
                    novasDatasMarcadas[evento.data].dots.push({ color: corDot });
                } else {
                    novasDatasMarcadas[evento.data] = {
                        marked: true,
                        dots: [{ color: corDot }],
                    };
                }
            });
   
            setMarkedDates(novasDatasMarcadas);
        } catch (error) {
            console.log("Erro ao carregar datas marcadas:", error);
        }
    };
 
 
   
    // SÓ DEPOIS CHAMA NO useEffect
    useEffect(() => {
        carregarDatasMarcadas();
    }, []);
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
     
 
    const carregarTodosEventos = async () => {
        try {
          const eventosDoBanco = await analisar(""); // sem filtro de data
          setTodosEventos(eventosDoBanco);
        } catch (error) {
          console.log("Erro ao carregar todos eventos:", error);
        }
      };
     
      useEffect(() => {
        carregarDatasMarcadas(); // para marcar datas
        carregarTodosEventos(); // carrega todos eventos para mostrar abaixo
      }, []);
   
   
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D64F5" />
            </View>
        );
    }
 
    const carregarEventosDoDia = async (data) => {
        try {
            const resultado = await analisar(data);
            setEvents((prev) => ({
                ...prev,
                [data]: resultado,
            }));
        } catch (error) {
            console.log("Erro ao buscar eventos:", error);
        }
    };
 
    const resetarFormulario = () => {
        setTitulo("");
        setDescricao("");
        setPrioridade("");
        setEditandoEvento(null);
    };
 
    const salvarEvento = async () => {
        if (!selectedDate || titulo.trim() === "") {
            Alert.alert("Erro", "Selecione uma data e preencha o título");
            return;
        }
 
        if (editandoEvento) {
            // Atualizar evento existente
            try {
                await alterar({
                    id: editandoEvento.id,
                    data: selectedDate,
                    titulo: titulo.trim(),
                    descricao: descricao.trim(),
                    prioridade: prioridade.trim(),
                });
                await carregarEventosDoDia(selectedDate);
                await carregarDatasMarcadas();
                resetarFormulario();
            } catch (error) {
                console.log("Erro ao atualizar evento:", error);
            }
        } else {
            // Criar novo evento
            try {
                await criar({
                    data: selectedDate,
                    titulo: titulo.trim(),
                    descricao: descricao.trim(),
                    prioridade: prioridade.trim(),
                });
                await carregarEventosDoDia(selectedDate);
                await carregarDatasMarcadas();
                resetarFormulario();
            } catch (error) {
                console.log("Erro ao criar evento:", error);
            }
        }
    };
 
    const iniciarEdicao = (evento) => {
        setEditandoEvento(evento);
        setTitulo(evento.titulo);
        setDescricao(evento.descricao);
        setPrioridade(evento.prioridade);
        setSelectedDate(evento.data);
    };
 
    const apagarEvento = (id) => {
        Alert.alert(
            "Confirmação",
            "Deseja realmente apagar este evento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await apagar(id);
                            await carregarEventosDoDia(selectedDate);
                            await carregarDatasMarcadas();
                            await carregarTodosEventos(); // <== aqui!
   
                            if (editandoEvento?.id === id) resetarFormulario();
                        } catch (error) {
                            console.log("Erro ao apagar evento:", error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };
 
 
    const handleDayPress = (day) => {
        const dataClicada = day.dateString;
   
        if (dataClicada === selectedDate) {
            setSelectedDate("");
            setBotaoFixado(false);
            resetarFormulario();
        } else {
            setSelectedDate(dataClicada);
            carregarEventosDoDia(dataClicada);
            resetarFormulario();
            setBotaoFixado(true);
        }
    };
 
    const formatarMesAno = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM yyyy", { locale: ptBR });
  };
 
  // Função para agrupar eventos por mês/ano
  const agruparEventosPorMes = (eventos) => {
    const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data));
    const grupos = eventosOrdenados.reduce((acc, evento) => {
      const mesAno = formatarMesAno(evento.data);
      if (!acc[mesAno]) acc[mesAno] = [];
      acc[mesAno].push(evento);
      return acc;
    }, {});
    return grupos;
  };
 
  // Depois usa a função
  const eventosAgrupados = agruparEventosPorMes(todosEventos);
   
    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.ContainerDoCalendario}>
                    <View style={styles.customHeader}>
                        <TouchableOpacity onPress={handlePrevMonth}>
                            <Feather name="chevron-left" size={24} color="#fff" />
                        </TouchableOpacity>
 
                        <Text style={styles.monthText}>
                            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                        </Text>
 
                        <TouchableOpacity onPress={handleNextMonth}>
                            <Feather name="chevron-right" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
 
                    <View style={styles.calendarContainer}>
                    <Calendar
                        key={format(currentDate, "yyyy-MM-dd")}
                        current={format(currentDate, "yyyy-MM-dd")}
                        onMonthChange={(month) => setCurrentDate(new Date(month.year, month.month - 1, 1))}
                        onDayPress={handleDayPress}
                        markedDates={{
                            ...markedDates,
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#FFFFFF',
                                selectedTextColor: '#6C63FF',
                                customStyles: {
                                    container: {
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 12,
                                        elevation: 6,
                                        shadowColor: '#6C63FF',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 6,
                                    },
                                    text: {
                                        color: '#6C63FF',
                                        fontWeight: '700',
                                    },
                                },
                            },
                            [today]: {
                                // Se o dia atual não for o selecionado
                                customStyles: {
                                    container: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)', // leve destaque
                                        borderWidth: 1.5,
                                        borderColor: '#FFFFFF',
                                        borderRadius: 12,
                                    },
                                    text: {
                                        color: '#FFFFFF',
                                        fontWeight: '600',
                                    },
                                },
                            },
                        }}
                        markingType="custom"
                        hideArrows={true}
                        hideExtraDays={false}
                        renderHeader={() => null}
                        theme={{
                            backgroundColor: '#D8D6FF',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: '#E0DEFF',
                            textSectionTitleDisabledColor: '#B7B7C9',
                            selectedDayBackgroundColor: '#FFFFFF',
                            selectedDayTextColor: '#6C63FF',
                            todayTextColor: '#FFFFFF', // fallback
                            dayTextColor: '#FFFFFF',
                            textDisabledColor: '#C5C5D6',
                            arrowColor: '#FFFFFF',
                            monthTextColor: '#FFFFFF',
                            textDayFontFamily: 'Poppins_400Regular',
                            textMonthFontFamily: 'Poppins_600SemiBold',
                            textDayHeaderFontFamily: 'Poppins_500Medium',
                            textDayFontSize: 16,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 14,
                            textDayFontWeight: '400',
                            todayBackgroundColor: 'transparent',
                            arrowStyle: { padding: 10 },
                        }}
                        style={{
                            borderRadius: 18,
                            width: 280,
                            alignSelf: 'center',
                            paddingVertical: 20,
                        }}
                    />
                    </View>
                </View>
       
                <View style={styles.contentTexto}>
                   
                </View>
 
               
            {todosEventos.length > 0 ? (
                Object.entries(eventosAgrupados).map(([mesAno, eventosDoMes]) => (
                    <View key={mesAno} style={{ marginBottom: 30 }}>
                    <Text
                        style={{
                        fontSize: 18,
                        color: '#77737A',
                        marginLeft: 45,
                        marginBottom: 10,
                        fontFamily: 'Poppins_500Medium',
                        }}
                    >
                        {mesAno.charAt(0).toUpperCase() + mesAno.slice(1)} {/* Primeira letra maiúscula */}
                    </Text>
 
                    {eventosDoMes.map((item) => (
                        <View
                        key={item.id}
                        style={{
                            position: "relative",
                            // Usar modalVisivelId para controlar o zIndex, não modalVisivelIndex
                            zIndex: modalVisivelId === item.id ? 10 : 1,
                        }}
                        >
                        <View style={styles.taskCard}>
                            <View style={[styles.barraPrioridade, { backgroundColor: getCorPrioridade(item.prioridade) }]} />
                            <View style={styles.cardConteudo}>
                            <View style={[styles.diaQuadrado, { backgroundColor: getCorPrioridade(item.prioridade) }]}>
                                <Text style={styles.diaTexto}>{item.data?.split("-")[2]}</Text>
                            </View>
                            <View style={styles.textosTarefa}>
                                <Text style={styles.taskTitle}>{item.titulo}</Text>
                                <Text style={styles.taskDescription}>
                                {item.descricao?.split(" ").slice(0, 5).join(" ") + (item.descricao?.split(" ").length > 5 ? "..." : "")}
                                </Text>
                            </View>
                            </View>
                            <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => setModalVisivelId(modalVisivelId === item.id ? null : item.id)}
                            >
                            <Feather name="more-vertical" size={20} color="#555" />
                            </TouchableOpacity>
                        </View>
 
                        {modalVisivelId === item.id && (
                            <View style={styles.modalAcoes}>
                            <TouchableOpacity
                                style={styles.modalOpcao}
                                onPress={() => {
                                    rota.push({
                                      pathname: "/editarEvento",
                                      params: {
                                        userId,
                                        id: item.id,
                                        titulo: item.titulo,
                                        descricao: item.descricao,
                                        prioridade: item.prioridade,
                                        data: item.data,
                                      },
                                    });
                                    setModalVisivelId(null);
                                  }}
                                 
                            >
                                <Text style={styles.modalTexto}>Editar</Text>
                            </TouchableOpacity>
 
                            <TouchableOpacity
                                style={[styles.modalOpcao, styles.modalExcluir]}
                                onPress={() => {
                                apagarEvento(item.id);
                                setModalVisivelId(null); // Corrigido aqui também
                                }}
                            >
                                <Text style={styles.modalTextoExcluir}>Excluir</Text>
                            </TouchableOpacity>
                            </View>
                        )}
                        </View>
                    ))}
                    </View>
                ))
                ) : (
                <Text style={styles.noTasksText}>Nenhuma tarefa cadastrada.</Text>
                )}
 
                               
 
            </ScrollView>
            {botaoFixado && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                    rota.push({
                        pathname: "/criar-evento",
                        params: { userId, dataSelecionada: selectedDate },
                    })
                    }
                >
                    <Feather name="plus" size={36} color="#fff" />
                </TouchableOpacity>
            )}
 
            <View style={styles.menu}>
                <View style={styles.contentMenu}>
                    <TouchableOpacity style={styles.btnHome} onPress={() => rota.push({ pathname: "/menu", params: { userId , usuarioAtual } })}>
                        <Image source={require("../../assets/images/Home.png")} style={styles.img2} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnAgenda}
                        onPress={() => rota.push({ pathname: "/calendario", params: { userId, usuarioAtual  } })}
                    >
                        <Image source={require("../../assets/images/calendarAtivo.png")} style={styles.img} />
                        <View style={styles.linha}></View>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnChat}
                        onPress={() => rota.push({ pathname: "/chatListScreen", params: { userId, usuarioAtual  } })}
                    >
                        <Image source={require("../../assets/images/Chat.png")} style={styles.img3} />
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.btnConfig}
                        onPress={() => rota.push({ pathname: "/configuracoes", params: { userId , usuarioAtual } })}
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
 
    img4: {
        bottom: 2,
    },
 
    linha: {
        left: 1,
        width: 60,
        height: 7,
        backgroundColor: "#5D64F5",
        top: 1,
 
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
 
    formContainer: {
        marginTop: 20,
        gap: 10,
    },
    addButton: {
        zIndex: 8,
        top: 500,
        backgroundColor: '#5568FE',
        borderRadius: 50,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        position: 'absolute',
        bottom: 30,
        marginTop: 70,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    ContainerDoCalendario: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 40,
    },
    calendarContainer: {
        backgroundColor: '#6C63FF',
        borderRadius: 24,
        padding: 15,
        width: 330,
        alignSelf: 'center',
        marginTop: 30,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
 
    calendar: {
        borderRadius: 15,
        width: 280, // ou '85%' para responsivo
        alignSelf: 'center', // centraliza o calendário dentro do container
        height: 'auto',
        paddingVertical: 20,
    },
    contentTexto: {
        marginTop: 80,
        marginLeft: 40,
        marginBottom: 20,
    },
    textoTarefas: {
        fontSize: 19,
        color: '#77737A'
    },
    taskList: {
        marginHorizontal: 45,
        marginTop: 120,
        marginBottom: -30,
        gap: 40,
    },
     
    taskCard: {
        zIndex: 1,
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 25,
        width: 330,
        alignSelf: "center",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
 
    barraPrioridade: {
        width: 4,
        height: "100%",
        borderRadius: 2,
        marginRight: 10,
    },
 
    cardConteudo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
 
    diaQuadrado: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
 
    diaTexto: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
    },
 
    textosTarefa: {
        flex: 1,
        justifyContent: "center",
    },
 
    taskTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
        fontFamily: "Poppins_600SemiBold",
    },
 
    taskDescription: {
        fontSize: 13,
        color: "#888",
        fontFamily: "Poppins_400Regular",
    },
 
    menuButton: {
        padding: 6,
        position: "absolute",
        right: 10,
        top: 14,
    },
    modalAcoes: {
        position: "absolute",
        right: 30,
        top: 45,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingVertical: 4,
        width: 110,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 999,
    },
 
    modalOpcao: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
 
    modalTexto: {
        color: "#333",
        fontSize: 15,
        fontFamily: "Poppins_500Medium",
    },
 
    // Estilo especial só para a opção de Excluir
   
 
    customHeader: {
        backgroundColor: '#6C63FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 18,
        borderRadius: 22,
        width: 330,
        alignSelf: 'center',
        marginTop: 25,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 4,
    },
 
      monthText: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: '#fff',
        textTransform: 'capitalize',
    },
     
});
 
 