import { Text, StyleSheet, View, ScrollView, TextInput, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
// import { Image } from 'expo-image';
import { Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function Welcome() {

  const navigation = useNavigation();
  const [loaded, error] = useFonts(
    {
      "Fredoka_Condensed-Medium": require("./assets/fonts/Fredoka_Condensed-Medium.ttf"),
      "Nunito-VariableFont_wght": require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
      "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
      "SofadiOne-Regular": require("./assets/fonts/SofadiOne-Regular.ttf"),
      "Fredoka-Medium": require("./assets/fonts/Fredoka-Medium.ttf"),

    }
  );
  const [getShowPassword, setShowPassword] = useState(true);
  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      };
    }, [loaded, error]
  );
  if (!loaded && !error) {
    return null;
  }
  const chatLogo = require("./assets/images/chat-box.png");
  return (
    <LinearGradient

      colors={['#d2f5e3', '#c2eaf0', '#f0f0f0']}
      style={styles.gradientBackground}
    >
       <StatusBar hidden={true} />
      <ScrollView>



        <View style={styles.view1}>

          <View style={styles.view2}>
            <Image source={chatLogo} style={styles.image1} contentFit={"contain"} />
            <Text style={styles.text1}>Chatty</Text>
          </View>

          <Text style={styles.text2}>Hello! Welcome to Chatty</Text>
            <Text style={styles.text3}>Chat with your friends, share photo and video files fast with high quality</Text>
         

          <Pressable style={styles.pressable1} onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.text4}> GET STARTED</Text>
            <FontAwesome6 name="angle-right" size={16} color={"#E7F8F8"} />
          </Pressable>

        </View>
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
    rowGap: 12,
    paddingVertical: 120,

  },

  view2: {
    justifyContent: "center",
    alignItems: "center",
  },

  text1: {
    fontSize: 40,
    fontFamily: "SofadiOne-Regular",
    color: "#3B918A",

  },

  text2: {
    fontSize: 30,
    color: "#004E74",
    fontFamily: "Fredoka-Medium",
  },
  text3: {
    fontSize: 20,
    color: "#1c1c1c",
    fontFamily: "Fredoka-Medium",
  },


  text4: {
    fontSize: 20,
    fontFamily: "Nunito-Medium",
    fontWeight: "bold",
    color: "#E7F8F8",
  },
 


  pressable1: {
    width: "60%",
    height: 50,
    backgroundColor: "#28C8C8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 15,
    flexDirection:"row",
    columnGap:10,
    alignSelf:"center",
    marginTop:15,
  },

  image1: {
    width: 130,
    height: 130,
  },


});
