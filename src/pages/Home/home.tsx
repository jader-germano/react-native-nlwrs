import React, { useState, useEffect } from 'react' ;
import { Feather as Icon } from '@expo/vector-icons'
import { Image, ImageBackground, Text, View, KeyboardAvoidingView, StyleSheet, Platform, Alert } from "react-native";
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';


import axios from 'axios';

interface IBGEUFResponse {
    sigla: string,
}

interface IBGECityResponse {
    nome: string,
}

interface Uf {
    value: string,
    label: string
}

interface City {
    value: string,
    label: string
}

const Home = () => {
    const [ufs, setUfs] = useState<Uf[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [uf, setUf] = useState<Uf>();
    const [city, setCity] = useState<City>();

    const navigation = useNavigation();

    function handleNavigateToPoints() {
        if (!uf || !city) {
            Alert.alert('Notificação', 'Por favor, selecione ambos Estado e Cidade.');
            return;
        }

        navigation.navigate('Points', {
            uf,
            city
        });
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => {
                    const value = {
                        value: uf.sigla,
                        label: uf.sigla
                    } as Uf;
                    return value;
                });
                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        if (!uf) {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(uf => {
                    const value = {
                        value: uf.nome,
                        label: uf.nome
                    } as City;
                    return value;
                });
                setCities(cityNames);
            });
    }, [uf]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{
                    width: 274,
                    height: 368
                }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}/>
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione um Estado...',
                            value: null,
                        }}
                        items={ufs}
                        onValueChange={(value) => {
                            setUf(value);
                        }}
                        style={{ ...styles }}
                        value={uf}
                        useNativeAndroidPickerStyle={false} //android only
                    />
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma Cidade...',
                            value: null,
                        }}
                        items={cities}
                        onValueChange={(value) => {
                            setCity(value);
                        }}
                        style={{ ...styles }}
                        value={city}
                        useNativeAndroidPickerStyle={false} //android only
                    />
                </View>
                <View style={styles.footer}>
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon
                                    name="arrow-right"
                                    color="#FFF" size={24}
                                />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },
});
export default Home;