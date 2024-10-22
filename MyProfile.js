import { Text, StyleSheet, View, ScrollView, TextInput, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SplashScreen } from "expo-router";
import { useNavigation } from '@react-navigation/native';

export default function MyProfile({ route }) {
    const [loaded, error] = useFonts({
        "Fredoka_Condensed-Medium": require("./assets/fonts/Fredoka_Condensed-Medium.ttf"),
        "Nunito-VariableFont_wght": require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
        "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
        "Fredoka-Medium": require("./assets/fonts/Fredoka-Medium.ttf"),
    });

    const { userId, userName, userPhone, userAvatarImage } = route.params;
    console.log(userAvatarImage);
    console.log('User Avatar Image:', getImage);
    console.log('Route Params:', route.params);


    const navigation = useNavigation();
    const [getImage, setImage] = useState(userAvatarImage);  
    const [getName, setName] = useState(userName);  
    const [getPhone, setPhone] = useState(userPhone);  
    const [password, setPassword] = useState(""); 
    useEffect(() => {
        if (loaded && !error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    // Function to pick image from gallery
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

    // Function to handle the form submission
    const handleSave = async () => {
        const formData = new FormData();

        if (getImage) {
            formData.append("avatarImage", {
                uri: getImage,
                name: "avatar.png",
                type: "image/png",
            });
        }

        // Split name into first name and last name
        const names = getName.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('mobile', getPhone);
        formData.append('password', password);

        try {
            const response = await fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/UpdateUser", {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error Response:', errorText);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                navigation.navigate('Home');
            } else {
                alert(result.message);
          
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    return (
        <LinearGradient colors={['#dcdcdc', '#f5f5f5', '#f0f0f0']} style={styles.gradientBackground}>
            <StatusBar hidden={true} />
            <ScrollView>
                <View style={styles.view1}>
                    {/* Profile Image */}
                    <Pressable style={styles.avatarCircle} onPress={handleImagePicker}>
                        {getImage ? (
                            <Image source={{ uri: getImage }} style={styles.avatarImage} />
                        ) : (
                            <FontAwesome6 name="camera" size={28} color="#ccc" />
                        )}
                    </Pressable>

                    {/* Name */}
                    {/* <Text style={styles.labelText}>Name</Text> */}
                    <View style={styles.editableRow}>
                        <TextInput
                            style={styles.textInput}
                            value={getName}
                            onChangeText={(text) => setName(text)}
                        />
                        <MaterialIcons name="edit" size={24} color="black" />
                    </View>

                    {/* Phone Number */}
                    <Text style={styles.labelText2}>Phone Number</Text>
                    <View style={styles.editableRow}>
                        <TextInput
                            style={styles.textInput}
                            value={getPhone}
                            onChangeText={(text) => setPhone(text)}
                            keyboardType="phone-pad"
                        />
                        <MaterialIcons name="edit" size={24} color="black" />
                    </View>

                    {/* Password */}
                    <Text style={styles.labelText2}>Password</Text>
                    <View style={styles.editableRow}>
                        <TextInput
                            style={styles.textInput}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                            placeholder="Enter new password"
                        />
                        <MaterialIcons name="edit" size={24} color="black" />
                    </View>

                    {/* Save Button */} 
                    <Pressable style={styles.pressable1} onPress={handleSave}>
                        <Text style={styles.text4}>Save</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1
    },
    view1: {
        paddingHorizontal: 20,
        rowGap: 8,
        paddingVertical: 100
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#E5E5E5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        alignSelf: "center",
        borderWidth: 1.5,
        borderColor: "gray"
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2
    },
    labelText: {
        fontSize: 16,
        color: "#004E74",
        marginTop: 15,
        marginBottom: 5,
        fontFamily: "Fredoka-Medium",
        textAlign: "center"
    },
    labelText2: {
        fontSize: 16,
        color: "#004E74",
        marginTop: 15,
        marginBottom: 5,
        left: 12,
        fontFamily: "Fredoka-Medium"
    },
    editableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    textInput: {
        flex: 1,
        color: "#004E74",
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        fontFamily: "Nunito-Medium",
        paddingVertical: 10
    },
    staticText: {
        fontSize: 18,
        fontFamily: "Nunito-Medium",
        color: "#7A7A7A",
        marginBottom: 20
    },
    pressable1: {
        width: "100%",
        height: 50,
        backgroundColor: "#28C8C8",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: 15
    },
    text4: {
        fontSize: 20,
        fontFamily: "Nunito-Medium",
        fontWeight: "bold",
        color: "#E7F8F8"
    }
});
