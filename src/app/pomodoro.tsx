import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	useFonts,
} from "@expo-google-fonts/poppins";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { BotaoVoltar } from "../components/BtnVoltar";
 
export default function Pomodoro() {
    const rota = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
    const [duracaoTotal, setDuracaoTotal] = useState(1500); // 25 min
    const [segundosRestantes, setSegundosRestantes] = useState(1500);
    const [rodando, setRodando] = useState(false);
    const [progresso, setProgresso] = useState(0);
    const somAlarme = useRef(new Audio.Sound());
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular,
    });
 
    useEffect(() => {
        const carregarSom = async () => {
            await somAlarme.current.loadAsync(require("../../assets/alarme.wav"));
        };
        carregarSom();
        return () => {
            somAlarme.current.unloadAsync();
        };
    }, []);
 
    useEffect(() => {
        if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
          setUsuarioAtual(undefined);
        } else {
          setUsuarioAtual(usuarioAtualParam);
        }
      }, [usuarioAtualParam]);
 
 
    useEffect(() => {
        let intervalo;
        if (rodando && segundosRestantes > 0) {
            intervalo = setInterval(() => {
                setSegundosRestantes((prev) => prev - 1);
                setProgresso(((duracaoTotal - segundosRestantes + 1) / duracaoTotal) * 100);
            }, 1000);
        } else if (segundosRestantes === 0) {
            tocarAlarme();
            setRodando(false);
        }
        return () => clearInterval(intervalo);
    }, [rodando, segundosRestantes]);
 
    const formatarTempo = () => {
        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;
        return `${minutos < 10 ? "0" + minutos : minutos}:${segundos < 10 ? "0" + segundos : segundos}`;
    };
 
    const reiniciarTimer = () => {
        setSegundosRestantes(duracaoTotal);
        setRodando(false);
        setProgresso(0);
    };
 
    const aumentarTempo = () => {
        if (!rodando && duracaoTotal < 3600) {
            setDuracaoTotal(duracaoTotal + 300);
            setSegundosRestantes(duracaoTotal + 300);
        }
    };
 
    const diminuirTempo = () => {
        if (!rodando && duracaoTotal > 300) {
            setDuracaoTotal(duracaoTotal - 300);
            setSegundosRestantes(duracaoTotal - 300);
        }
    };
 
    const tocarAlarme = async () => {
        try {
            await somAlarme.current.replayAsync();
        } catch (error) {
            console.log("Erro ao tocar alarme:", error);
        }
    };
 
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5D64F5" />
            </View>
        );
    }
 
    return (
        <LinearGradient colors={["#F3F3F3", "#EDEBFF"]} style={styles.tela}>
            <View style={styles.content}>
                <BotaoVoltar titulo="Método Pomodoro" onPress={() => rota.push({ pathname: "/menu", params: { userId , usuarioAtual} })} />
            </View>
 
            <View style={styles.container}>
                <AnimatedCircularProgress
                    size={270}
                    width={25}
                    fill={progresso}
                    tintColor="#AFB2F5"
                    backgroundColor="#5D64F5"
                    rotation={0}
                    duration={800}
                    style={styles.circularProgress}
                >
                    {() => (
                        <View style={styles.centro}>
                            <Text style={[styles.tempo, { fontFamily: "Poppins_700Bold" }]}>{formatarTempo()}</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>
 
                <TouchableOpacity style={styles.botao} onPress={() => setRodando(!rodando)}>
                    <Text style={[styles.textoBotao, { fontFamily: "Poppins_600SemiBold" }]}>
                        {rodando ? "Pausar" : "Iniciar"}
                    </Text>
                </TouchableOpacity>
 
                <TouchableOpacity style={styles.botao} onPress={reiniciarTimer}>
                    <Text style={[styles.textoBotao, { fontFamily: "Poppins_600SemiBold" }]}>Reiniciar</Text>
                </TouchableOpacity>
 
                <View style={styles.linhaBotoes}>
                    <TouchableOpacity style={styles.botaoMenor} onPress={diminuirTempo}>
                        <Text style={[styles.textoBotao, { fontFamily: "Poppins_600SemiBold" }]}>-5 min</Text>
                    </TouchableOpacity>
 
                    <TouchableOpacity style={styles.botaoMenor} onPress={aumentarTempo}>
                        <Text style={[styles.textoBotao, { fontFamily: "Poppins_600SemiBold" }]}>+5 min</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}
 
const styles = StyleSheet.create({
    tela: {
        flex: 1,
        height: '100%'
    },
    content: {
        left: 10,
        paddingHorizontal: 32,
        marginTop: 20,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    circularProgress: {
        marginBottom: 40,
    },
    centro: {
        alignItems: "center",
        justifyContent: "center",
    },
    tempo: {
        fontSize: 52,
        color: "#5E5E5E",
    },
    botao: {
        backgroundColor: "#8E97FD",
        paddingVertical: 14,
        width: 160,
        borderRadius: 14,
        marginBottom: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    textoBotao: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    linhaBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 220,
        marginTop: 12,
    },
    botaoMenor: {
        backgroundColor: "#C1C4FF",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
 
 