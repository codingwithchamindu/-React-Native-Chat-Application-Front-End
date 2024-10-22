import { Text, StyleSheet, View, ScrollView, TextInput, Pressable, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

// Custom Alert Component
const CustomAlert = ({ visible, message, onClose, title, type }) => {
    return (
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

                   
                    {type === 'success' ? (
                        <Pressable
                            style={[styles.button, styles.buttonClose2]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </Modal>
    );
};


export default function SignUp() {
    const navigation = useNavigation();
    const [loaded, error] = useFonts({
        "Fredoka_Condensed-Medium": require("./assets/fonts/Fredoka_Condensed-Medium.ttf"),
        "Nunito-VariableFont_wght": require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
        "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
        "SofadiOne-Regular": require("./assets/fonts/SofadiOne-Regular.ttf"),
        "Fredoka-Medium": require("./assets/fonts/Fredoka-Medium.ttf"),
    });

    const [getShowPassword, setShowPassword] = useState(true);
    const [getImage, setImage] = useState(null);
    const [getMobile, setMobile] = useState("");
    const [getFirstName, setFirstName] = useState("");
    const [getLastName, setLastName] = useState("");
    const [getPassword, setPassword] = useState("");

    //custom alerts
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    useEffect(() => {
        if (loaded && !error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const chatLogo = require("./assets/images/chat-box.png");

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        let formData = new FormData();
        formData.append("mobile", getMobile);
        formData.append("firstName", getFirstName);
        formData.append("lastName", getLastName);
        formData.append("password", getPassword);

        if (getImage != null) {
            formData.append("avatarImage", {
                name: "avatar.png",
                type: "image/png",
                uri: getImage
            });
        }

        try {
            let response = await fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app /ChattyMessenger/SignUp", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                let json = await response.json();
                if (json.success) {
                    setAlertTitle("Success!");
                    setAlertMessage(json.message);
                    setAlertType("success");

                    setAlertVisible(true);

                    navigation.navigate('Sign In');

                } else {
                    setAlertTitle("Warning!"); 
                    setAlertMessage(json.message);
                    setAlertType("error");
                    setAlertVisible(true);
                }
            } else {
                setAlertTitle("Error");
                setAlertMessage("Server error, please try again.");
                setAlertType("error");
            }
        } catch (error) {
            setAlertTitle("Error");
            setAlertMessage("Failed to connect to server.");
            setAlertType("error");
        }

        setAlertVisible(true);
    };

    return (
        <LinearGradient colors={['#d2f5e3', '#c2eaf0', '#f0f0f0']} style={styles.gradientBackground}>
            <StatusBar hidden={true} />
            <ScrollView>
                <View style={styles.view1}>
                    <Pressable style={styles.avatarCircle} onPress={handleImagePicker}>
                        {getImage ? (
                            <Image source={{ uri: getImage }} style={styles.avatarImage} />
                        ) : (
                            <FontAwesome6 name="camera" size={28} color="#ccc" />
                        )}
                    </Pressable>

                    <Text style={styles.text2}>Sign Up</Text>

                    <View style={styles.view3}>
                        <FontAwesome6 name="user" size={16} />
                        <Text style={styles.text3}>First Name</Text>
                    </View>
                    <TextInput
                        style={styles.textinput1}
                        maxLength={50}
                        placeholder="Enter Your First Name"
                        onChangeText={(text) => setFirstName(text)}
                    />

                    <View style={styles.view3}>
                        <FontAwesome6 name="user" size={16} />
                        <Text style={styles.text3}>Last Name</Text>
                    </View>
                    <TextInput
                        style={styles.textinput1}
                        maxLength={50}
                        placeholder="Enter Your Last Name"
                        onChangeText={(text) => setLastName(text)}
                    />

                    <View style={styles.view3}>
                        <FontAwesome6 name="mobile-screen-button" size={16} />
                        <Text style={styles.text3}>Mobile</Text>
                    </View>
                    <TextInput
                        style={styles.textinput1}
                        maxLength={10}
                        placeholder="Enter Your Mobile"
                        keyboardType="phone-pad"
                        onChangeText={(text) => setMobile(text)}
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
                        maxLength={50}
                        secureTextEntry={getShowPassword}
                        placeholder="Enter Your Password"
                        onChangeText={(text) => setPassword(text)}
                    />

                    <Pressable style={styles.pressable1} onPress={handleRegister}>
                        <Text style={styles.text4}>Register</Text>
                    </Pressable>

                    <Pressable style={styles.pressable2} onPress={() => navigation.navigate('Sign In')}>
                        <Text style={styles.text5}>Already a user?</Text>
                        <Text style={styles.text6}>Login here</Text>
                    </Pressable>

                    <View style={styles.view2}>
                        <Text style={styles.text1}>Chatty</Text>
                        <Image source={chatLogo} style={styles.image1} contentFit={"contain"} />
                    </View>
                </View>

                {/* Custom Alert Component */}
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
        paddingHorizontal: 20,
        rowGap: 8,
        paddingVertical: 20,
    },
    view2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        marginBottom: 5,
        columnGap: 5,
    },
    view3: {
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center",
    },
    text1: {
        fontSize: 30,
        fontFamily: "SofadiOne-Regular",
        color: "#3B918A",
        marginRight: 5,
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
        marginTop: 2,
    },
    pressable2: {
        flexDirection: "row",
        columnGap: 8,
        paddingVertical: 4,
        padding: 2,
    },
    image1: {
        width: 50,
        height: 50,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E5E5E5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 2,
        alignSelf: "center",
        borderWidth: 1.5,
        borderColor: "gray",
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
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
