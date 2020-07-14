import React, { useEffect, useState } from "react";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { RectButton } from 'react-native-gesture-handler';
import api from "../../services/api";
import * as MailComposer from 'expo-mail-composer';

import Spinner from 'react-native-loading-spinner-overlay';

interface Params {
    point_id: number;
}

interface Data {
    collectPoint: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string
    };
    items: {
        title: string
    }[];
}

const Detail = () => {

    const [data, setData] = useState<Data>({} as Data);
    const [spinner, setSpinner] = useState<boolean>(true);
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        api.get(`collect-point/${routeParams.point_id}`).then(response => {
            setData(response.data);
            setSpinner(false);
        });

    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.collectPoint.whatsapp}&text=Tenho interesse sobre coleta de resíduos. `)
    }

    function handlwComposeMail() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.collectPoint.email],
        })
    }
    if (!data.collectPoint) {
        return null;
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>
                <View>
                    <Spinner
                        visible={spinner}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <Image style={styles.pointImage}
                    source={{ uri: data.collectPoint.image_url }}/>

                <Text style={styles.pointName}>{data.collectPoint.name}</Text>
                <Text style={styles.pointItems}>
                    {data.items?.map(item => item.title).join(', ')}
                </Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{`${data.collectPoint.city}, ${data.collectPoint.uf}`}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handlwComposeMail}>
                    <Icon name="mail" size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20,
        backgroundColor: '#F5FCFF'
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});
export default Detail;