import { PessoasDataBase } from "@/database/useUsuarioDataBase";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BotaoVoltar } from "../components/BtnVoltar";

export default function TelaSaudeMental() {
    const router = useRouter();
    const { userId, usuarioAtual: usuarioAtualParam } = useLocalSearchParams();
    const [usuarioAtual, setUsuarioAtual] = useState<string | undefined>(usuarioAtualParam);
	const [usuario, setUsuario] = useState<PessoasDataBase | undefined>(undefined);
    const scrollRef = useRef<ScrollView>(null);
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_400Regular
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
                    <BotaoVoltar titulo="Saúde Mental" onPress={() => router.push({ pathname: "/menu", params: { userId,usuarioAtual } })} />
                </View>

                <View style={styles.containerCardImagem}>
                    <View style={styles.cardImagem}></View>
                </View>

                <View style={styles.containerCards}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/respiracao", params: { userId , usuarioAtual } })}>
                        <Image
                        source={{ uri: 'data:image/png;base64,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' }}
                        style={styles.icon}
                        />
                        <Text style={[styles.textCard, { fontFamily: 'Poppins_600SemiBold' }]}>Respirar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/som", params: { userId, usuarioAtual } })}>
                        <Image
                        source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFWElEQVR4nO1ba4gcRRCu8xFRVHwrKmoQxVdAUfwhSFATxQe+wmpy273rTdfsmehp9JcKej+MCuIfPRFJFImoUYIkKv4RFcVg8B1f+DbGHz5yMcabqt2Lxhup2QvZ7dvd27np2Z3IftCw7C71fVPdXV1d3QPQQw899NBDuigOVk4omEBpQ49q5Nc00g/a8FZt6J9q463K0PeTv40oDPL9Xvl42J2RRz5WG7pHIX+qkcOZNGX4E23o7sIgHwO7C/pLwRxlaHXUszN88KmOoL+1oRcKGJwOWYW6MThCG16pDP3r6sGnNtqhDT+1qDR2GGQJeSxfpw2PtuhBccoGZegR+W8R+WxdKh9XKoX7SZPP0XemfL38Z/K/zR1p+Hfl84JuPzfkcuGeCvmhFr22QSHfpPVfh8a1Lb2sDN8sNlrEiAdFA3QDQ0PhPtrQS82CV8GnSwHCvuRMYZ/Yau4IWpPLhbOgk8jlwlkK+dUGQ52lx9PolWi0yYgwVG7g8FdKpXBv6BQU8pMNRHylzdipaXPnB8ZO08hfN+BfDp2Aqs7LenKkdcZsO6QjAgBAYoo2tL6BExanS4zjJ9tDUBKdYvHPg6DDyOe3HKgNf2RPwUWD4yelRqqQ3rYe/tdikY6CLmGhx0fLkmgtkW+kQqYNXWZF34mCRxdDl1FdIWjC0naJcyKF9EG9p+k5yAgkTbZi0ntOCQqGz7U8vF12eJARKKzMjvYLtRo9PscdgeHl1tx/FjIGhfS81UmPOTE8PBzuoZA31xrPY/l8yBi0X55rLYu/OclEi0hnWlF2VJwCGUOjjpKteWLDGnmp5YBnIKOQwGwlRrckN4q8whpaQ5BR2J2lkB5PbFQZeqfOAX4wDzIKWf+tzPAtF0Z/qvdqZTZkFIVS5UQrV/kxsVGF/Eet0U5uemZSRLEDdmKjGml7rdGOFx/iFmnqp8C4cwfMHQ73goxCtNkZq/MpkFsS7g8ZheeNHmBlrFsSG1WGNtUaHRgYOxyyXJqvnwIbExvVyF/WZVeTR1Ya6QqF/LGQTB5zlTWS7+JBWushP+KqHqdtFA15jy6X30SblbN8nphQIb1ba7RYGjslEmL4M7skNdmugpRQQL6mEadUpeR30WaX6hKTaqSX67eZdJbygjOaPLysveshJcg+vxmvHJuJNmsKrE1Mqg0/UWfUL5+nkJc1E+Jk6WkCsd2UF3mZaLO+X5GcFPmBuq2wF1ykkb5rOgJkpbgt3BccIzpCa8EZHbn7wTwrEbovMbHG8u2W0XtbC+FwoQmOBMeQ4ut0vA20LU1MrD3SVmD5eTohaZSmxeZ0vLY2uZThfIel22hy0guOEZ0ex9ThpGrdXwrmxCcOLgDHUBhcGFuHiwsVWo6hYhLnfb4SHEN5fHVcHf2Ltx3sgDrsU0iVWJ53MfcsKKRCHA2i2c3xPEwtikzbfF4CHTiUbdlcFEOapcNtkN8BjqEM3RlzBKxzR470YjwHOEhALGjk+2M5wNBqh+Q0Ei8A0Ygz8p0aqpcs42h42Bl5HumumCNgJTiGQn66a9NQGRqI6f01zsh3aVgb0wFFZ+Q6fjb4OjiGQn4zXgwI5ju9iaFi3ACVuwTgGAr5wxgjcIfzmysKychmQ+7htBGBv0khCH7bBi9HNUyPPEgLqp14YPgX17xy3N3GyLsB0obyeUEbQ5Bc8za6INnA8ddC2lAmmN9GT1Rc89oHNKkHvmaQuzdtLEHvQzeCoMt7Qa2gTTln38aoGf4TaZTGqyVx+zrczhHHm0UTdP4FCVpV887PJmX4i7zPt6bFKbaFI4r0u945WiVa0uLsoYceeugB/sf4D+w/N6Raf05/AAAAAElFTkSuQmCC' }}
                        style={styles.icon2}
                        />
                        <Text style={[styles.textCard, { fontFamily: 'Poppins_600SemiBold' }]}>Sons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/meditar", params: { userId , usuarioAtual} })}>
                        <Image
                        source={{ uri: 'data:image/png;base64,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' }}
                        style={styles.icon3}
                        />
                        <Text style={[styles.textCard, { fontFamily: 'Poppins_600SemiBold' }]}>Meditar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerAnsiedade}>
                    <TouchableOpacity style={styles.cardAnsiedade}>
                        <Text style={[styles.textoAnsiedade, { fontFamily: 'Poppins_500Medium' }]}>O que é ansiedade?</Text>
                        <Image source={require("../../assets/images/arrow.png")} style={styles.seta}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardAnsiedade}>
                        <Text style={[styles.textoAnsiedade, { fontFamily: 'Poppins_500Medium' }]}>Encontre Ajuda</Text>
                        <Image source={require("../../assets/images/arrow.png")} style={styles.seta3}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardAnsiedade}>
                        <Text style={[styles.textoAnsiedade, { fontFamily: 'Poppins_500Medium' }]}>Psicologa Solidária</Text>
                        <Image source={require("../../assets/images/arrow.png")} style={styles.seta2}/>
                    </TouchableOpacity>
                </View>

               
             </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create ({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    tela: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },

    content: {
        left: 10,
        top: 10,
        paddingHorizontal: 32,
    },

    scrollContent: {
        paddingBottom: 100
    },


    containerCardImagem: {
        top: 130,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardImagem: {
        width: 320,
        height: 160,
        backgroundColor: '#BEC1F4',
        borderRadius: 18,
    },

    containerCards: {
        marginRight: 50,
        flexDirection: 'row',
        marginTop: 170,
        justifyContent: 'center',
        alignItems: 'center',
        left: 35,
    },

    card: {
        width: 100,
        height: 106,
        backgroundColor: '#DDDEF3',
        borderRadius: 12,
        marginRight: 18,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 10,
    },

    icon: {
        width: 40,
        height: 40,
        top: 10,
    },

    icon2: {
        width: 45,
        height: 40,
        top: 10,
    },

    icon3: {
        width: 40,
        height: 40,
        top: 10,
    },
    
    
    textCard: {
        fontSize: 13,
        color: '#5D64F5',
        textAlign: 'left',
    },

    containerAnsiedade: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },

    cardAnsiedade: {
        borderRadius: 18,
        width: 325,
        height: 80,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        flexDirection: 'row',     
        alignItems: 'center',      
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },

    seta: {
        left: 60,
    },

    seta2: {
        left: 70,
    },

    seta3: {
        left: 105,
    },


    textoAnsiedade: {
        fontSize: 18,
        color: '#5D64F5',
        textAlign: 'left',
    },

});
