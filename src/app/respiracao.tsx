import { PessoasDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BotaoVoltar } from "../components/BtnVoltar";
 
export default function CursoRedacao() {
  const router = useRouter();
  const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
  const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
  const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
  const videoLocal = require('../../assets/peixinho.mp4'); // vídeo local
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
  });
 
  // Estado aceita string (URL) ou number (require)
  const [videoUri, setVideoUri] = useState<string | number | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);
 
 
  useEffect(() => {
    if (usuarioAtualParam === "undefined" || usuarioAtualParam === undefined) {
      setUsuarioAtual(undefined);
    } else {
      setUsuarioAtual(usuarioAtualParam);
    }
    }, [usuarioAtualParam]);
 
     
  if (!fontsLoaded) {
    return <Text>Carregando...</Text>;
  }
 
  const aulas = [
    {
      titulo: "Ansiedade? Respire com Consciência",
      duracao: "12 min",
      videoUri: videoLocal, // vídeo local
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
        {/* Cabeçalho */}
        <View style={styles.content}>
          <BotaoVoltar titulo="Respiração" onPress={() => router.push({ pathname: "/saudeMental", params: { userId , usuarioAtual} })} />
        </View>
 
        {/* Aulas */}
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
 
      {/* Modal do vídeo */}
      <Modal visible={videoVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: "#000" }}>   
          <Pressable
            onPress={fecharVideo}
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {videoUri && (
            <Video
              source={typeof videoUri === "string" ? { uri: videoUri } : videoUri}
              style={{ width: "90%", height: undefined, aspectRatio: 16 / 9 }}
              useNativeControls
              shouldPlay
              resizeMode="contain"
            />
          )}
      </View>
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
 
  conatinerBanner: {
    top: 120,
    justifyContent: "center",
    alignItems: "center",
  },
 
  banner: {
    flexDirection: "row",
    backgroundColor: "#7B81F5",
    borderRadius: 16,
    padding: 20,
    width: 320,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
 
  bannerInfo: {
    marginLeft: 16,
  },
 
  bannerTitulo: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
 
  bannerAutor: {
    color: "#DDE2FF",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
 
  bannerDetalhes: {
    color: "#DDE2FF",
    fontSize: 12,
    marginTop: 4,
  },
 
  containerTexto: {
    top: 120,
    width: "100%",
    paddingHorizontal: 50,
  },
 
  sobreTitulo: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333B50",
    marginTop: 10,
    marginBottom: 6,
  },
 
  sobreTexto: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6C7382",
    marginBottom: 20,
    textAlign: "left",
    lineHeight: 20,
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
});
 