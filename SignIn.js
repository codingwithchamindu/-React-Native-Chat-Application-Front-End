import { Text, StyleSheet, View, ScrollView, TextInput, Pressable, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState, useCallback } from "react";
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";
import React from 'react';


SplashScreen.preventAutoHideAsync();

const CustomAlert = React.memo(({ visible, message, onClose, title, type }) => {
    return (
        visible && (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, type === 'success' ? styles.success : styles.error]}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.modalText}>{message}</Text>
                        <Pressable
                            style={[styles.button, type === 'success' ? styles.buttonClose2 : styles.buttonClose]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    );
});

export default function SignIn() {


    const [fontsLoaded] = useFonts({
        "Fredoka_Condensed-Medium": require("./assets/fonts/Fredoka_Condensed-Medium.ttf"),
        "Nunito-VariableFont_wght": require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
        "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
        "SofadiOne-Regular": require("./assets/fonts/SofadiOne-Regular.ttf"),
        "Fredoka-Medium": require("./assets/fonts/Fredoka-Medium.ttf"),
    });

    // useEffect
    //     (
    //         () => {
    //             async function CheckUser() {
    //                 console.log("2");
    //                 try {
    //                     let userJson = await AsyncStorage.getItem("user");
    //                     if (userJson != null) {
    //                         navigation.navigate("Home");
    //                     }
    //                 } catch (error) {
    //                     console.log(error)
    //                 }
    //             }
    //             CheckUser();
    //         }, []

    //     );
    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [getShowPassword, setShowPassword] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const chatLogo = require("./assets/images/chat-box.png");

    // Debounced mobile input handler
    const handleMobileChange = debounce((text) => {
        setMobile(text);
    }, 300);

    // Optimized login handler (useCallback)
    const handleLogin = useCallback(async () => {
        try {
            let response = await Promise.race([
                fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/SignIn", {
                    method: "POST",
                    body: JSON.stringify({
                        mobile: getMobile,
                        password: getPassword,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }),
                // new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 5000))
            ]);

            if (response.ok) {
                let json = await response.json();
                if (json.success) {
                    let user = json.user;
                    setAlertTitle("Success!");
                    setAlertMessage("Hi " + user.first_name + " " + json.message);
                    setAlertType("success");

                    // Batch AsyncStorage update for better performance
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    navigation.navigate('Home');
                } else {
                    setAlertTitle("Warning!");
                    setAlertMessage(json.message);
                    setAlertType("error");
                }
            } else {
                setAlertTitle("Error");
                setAlertMessage("Network response was not ok. Status: " + response.status);
                setAlertType("error");
            }
        } catch (error) {
            setAlertTitle("Error");
            setAlertMessage(error.message);
            setAlertType("error");
        }
        setAlertVisible(true);
    }, [getMobile, getPassword]);

    return (
        <LinearGradient colors={['#d2f5e3', '#c2eaf0', '#f0f0f0']} style={styles.gradientBackground}>
            <ScrollView>
                <View style={styles.view1}>
                    <View style={styles.view2}>
                        <Image source={chatLogo} style={styles.image1} contentFit={"contain"} />
                        <Text style={styles.text1}>Chatty</Text>
                    </View>
                    <Text style={styles.text2}>Login</Text>

                    <View style={styles.view3}>
                        <FontAwesome6 name="mobile-screen-button" size={16} />
                        <Text style={styles.text3}>Mobile</Text>
                    </View>

                    <TextInput
                        style={styles.textinput1}
                        maxLength={10}
                        placeholder="Enter Your Mobile"
                        inputMode="tel"
                        onChangeText={handleMobileChange}
                    />

                    <View style={styles.view3}>
                        <FontAwesome6
                            name={getShowPassword ? "eye-slash" : "eye"}
                            size={16}
                            onPress={() => setShowPassword(!getShowPassword)}
                        />
                        <Text style={styles.text3}>Password</Text>
                    </View>

                    <TextInput
                        style={styles.textinput1}
                        maxLength={20}
                        secureTextEntry={getShowPassword}
                        placeholder="Enter Your Password"
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                    />

                    <Pressable style={styles.pressable1} onPress={handleLogin}>
                        <Text style={styles.text4}> Login</Text>
                    </Pressable>

                    <Pressable style={styles.pressable2} onPress={() => navigation.navigate('Sign Up')}>
                        <Text style={styles.text5}> New user ?</Text>
                        <Text style={styles.text6}> Create a new account here</Text>
                    </Pressable>
                </View>

                <CustomAlert
                    visible={alertVisible}
                    title={alertTitle}
                    message={alertMessage}
                    type={alertType}
                    onClose={() => setAlertVisible(false)}
                />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    view1: {
        flex: 1,
        paddingHorizontal: 20,
        rowGap: 10,
        paddingVertical: 80,
    },
    view2: {
        justifyContent: "center",
        alignItems: "center",
    },
    view3: {
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center",
    },
    text1: {
        fontSize: 38,
        fontFamily: "SofadiOne-Regular",
        color: "#3B918A",
    },
    text2: {
        fontSize: 26,
        color: "#004E74",
        fontFamily: "Fredoka-Medium",
    },
    text3: {
        fontSize: 18,
        fontFamily: "Fredoka-Medium",
    },
    text4: {
        fontSize: 20,
        fontFamily: "Nunito-Medium",
        fontWeight: "bold",
        color: "#E7F8F8",
    },
    text5: {
        fontSize: 17,
        fontFamily: "Nunito-Medium",
        fontWeight: "bold",
        color: "#004E74",
    },
    text6: {
        fontSize: 17,
        fontFamily: "Nunito-Medium",
        color: "#C7004A",
    },
    textinput1: {
        borderWidth: 1,
        width: "100%",
        height: 50,
        borderRadius: 20,
        padding: 10,
    },
    pressable1: {
        width: "100%",
        height: 50,
        backgroundColor: "#28C8C8",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: 15,
    },
    pressable2: {
        flexDirection: "row",
        columnGap: 8,
        paddingVertical: 4,
        padding: 2,
    },
    image1: {
        width: "100%",
        height: 130,

    },


    // Styles for custom alert modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#FF6F61",
    },
    buttonClose2: {
        backgroundColor: "#4CAF50",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    success: {
        borderColor: "#28a745",
        borderWidth: 2,
    },
    error: {
        borderColor: "#FDC086",
        borderWidth: 2,
    },
});
