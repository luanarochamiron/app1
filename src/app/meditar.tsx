import { PessoasDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";

export default function CursoRedacao() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
  const videoLocal = require('../../assets/meditar.mp4');
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const [videoUri, setVideoUri] = useState<string | number | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  if (!fontsLoaded) {
    return <Text>Carregando...</Text>;
  }

  const aulas = [
    {
      titulo: "Ansiedade? Medite com Consciência",
      duracao: "12 min",
      videoUri: videoLocal,
    },
  ];

  function abrirVideo(uri: string | number) {
    setVideoUri(uri);
    setVideoVisible(true);
  }

  function fecharVideo() {
    setVideoVisible(false);
    setVideoUri(null);
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <BotaoVoltar titulo="Meditação" onPress={() => router.push({ pathname: "/saudeMental", params: { userId } })} />
        </View>

        <View style={styles.containerAulas}>
          <Text style={styles.sobreTituloAulas}></Text>
          <View style={styles.cardsWrapper}>
            {aulas.map((aula, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cardAula}
                onPress={() => abrirVideo(aula.videoUri)}
              >
                <Ionicons name="play-circle" size={24} color="#4A60F2" />
                <View style={styles.aulaTexto}>
                  <Text style={styles.aulaTitulo}>{aula.titulo}</Text>
                  <Text style={styles.aulaDuracao}>{aula.duracao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal de vídeo tela cheia */}
      <Modal visible={videoVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Pressable onPress={fecharVideo} style={styles.botaoFechar}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </Pressable>

          {videoUri && (
            <Video
              source={typeof videoUri === "string" ? { uri: videoUri } : videoUri}
              style={styles.videoFullscreen}
              useNativeControls
              resizeMode="contain"
              shouldPlay
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    left: 10,
    top: 10,
    paddingHorizontal: 32,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  containerAulas: {
    top: 120,
    width: "100%",
    paddingHorizontal: 20,
  },
  sobreTituloAulas: {
    paddingHorizontal: 40,
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333B50",
    marginBottom: 20,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  cardsWrapper: {
    alignItems: "center",
  },
  cardAula: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: "90%",
    borderWidth: 0.5,
    borderColor: "#E0E4EB",
  },
  aulaTexto: {
    marginLeft: 14,
  },
  aulaTitulo: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#333B50",
  },
  aulaDuracao: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#6C7382",
  },

  // Estilos novos para o vídeo fullscreen
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoFullscreen: {
    flex: 1,
    width: "100%",
  },
  botaoFechar: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
