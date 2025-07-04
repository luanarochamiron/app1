import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DashboardAtividades() {
  const totalAtividades = 50;
  const alta = 15;
  const media = 20;
  const baixa = 15;

  const data = [
    {
      name: "Alta",
      population: alta,
      color: "#ff4d4d",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Média",
      population: media,
      color: "#ffa500",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Baixa",
      population: baixa,
      color: "#4da6ff",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  const porcentagemAlta = Math.round((alta / totalAtividades) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Tarefas</Text>

      <View style={styles.graficoContainer}>
        <PieChart
          data={data}
          width={screenWidth * 0.6}
          height={150}
          chartConfig={{
            color: () => `#333`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={false}
          center={[0, 0]}
        />

        <Text style={styles.porcentagem}>{porcentagemAlta}%</Text>
      </View>

      <View style={styles.legenda}>
        <View style={styles.itemLegenda}>
          <View style={[styles.cor, { backgroundColor: "#ff4d4d" }]} />
          <Text>Alta Prioridade</Text>
        </View>
        <View style={styles.itemLegenda}>
          <View style={[styles.cor, { backgroundColor: "#ffa500" }]} />
          <Text>Média Prioridade</Text>
        </View>
        <View style={styles.itemLegenda}>
          <View style={[styles.cor, { backgroundColor: "#4da6ff" }]} />
          <Text>Baixa Prioridade</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  graficoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  porcentagem: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  legenda: {
    marginTop: 15,
    width: "100%",
  },
  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
