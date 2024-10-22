import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlashList } from "@shopify/flash-list";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Chat() {

  const route = useRoute(); 
  const { other_user_id, other_user_name, avaterImageFound, other_user_mobile, other_user_status } = route.params;
  const userStatus = other_user_status === 1 ? "Online" : "Offline";
  const [getChatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState("");

  // Fetch chat array from server
  useEffect(() => {
    async function fetchChatArray() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);
        console.log(user.id);

        let response = await fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/LoadChat?logged_user_id="+user.id+ "&other_user_id="+ other_user_id);
        if (response.ok) {
          let chatArray = await response.json();
          setChatArray(chatArray);
        } else {
          console.log("Error fetching chat array");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchChatArray();
  }, []);

  // Handle sending chat
  const handleSendChat = async () => {
    if (getChatText.trim().length === 0) {
      Alert.alert("Error", "Please enter your message");
      return;
    }
  
    try {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
  
      let response = await fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/SendChat?logged_user_id=" + user.id + "&other_user_id=" + other_user_id + "&message=" + getChatText);
      
      if (response.ok) {
        let json = await response.json();
        if (json.success) {

         
          setChatArray(prevChatArray => [...prevChatArray, { side: "right", message: getChatText, datetime: new Date().toLocaleTimeString(), status: 1 }]);
          setChatText("");
        }
      } else {
        Alert.alert("Error", "Failed to send message");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <LinearGradient colors={['#dcdcdc', '#f5f5f5', '#f0f0f0']} style={styles.gradientBackground}>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {avaterImageFound ? (
            <Image
              style={styles.image}
              source={{ uri: "https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/User_Images/"+ other_user_mobile+ ".png" }}
            />
          ) : (
            <Text style={styles.placeholderAvatar}>{other_user_name.charAt(0)}</Text> // Placeholder with first letter of name
          )}
          <Text style={styles.nameText}>{other_user_name}</Text>
          <Text style={styles.statusText}>{userStatus}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.chatContainer}>
          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <View style={item.side === "right" ? styles.messageRight : styles.messageRight2}>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.timeText}>{item.datetime}</Text>
                {item.side === "right" && (
                  <FontAwesome6 name="check" color={item.status === 1 ? "green" : "white"} size={18} style={styles.timeText} />
                )}
              </View>
            )}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputContainer}
            placeholder="Type text..."
            value={getChatText}
            onChangeText={(text) => setChatText(text)}
          />
          <Pressable onPress={handleSendChat}>
            <FontAwesome6 name="paper-plane" size={30} style={styles.inputIcone} />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: '100%',
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderColor: "gray",
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    color: "green",
  },
  chatContainer: {
    flex: 2,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageRight: {
    backgroundColor: "#D3F5F5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    maxWidth: "80%",
    alignSelf: 'flex-end',
    borderWidth:2,
    borderColor:"#28C8C8" 
  },
  messageRight2: {
    backgroundColor: "#D2E8F0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    maxWidth: "80%",
    alignSelf: 'flex-start',
    borderWidth:2,
    borderColor:"#004E74",
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 5,
  },
  inputContainer: {
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 20,
    padding: 10,
  },
  inputView: {
    flexDirection: "row",
    padding: 18,
    alignItems: "center",
  },
  inputIcone: {
    right:40,
  },
  placeholderAvatar: {
    width: 90,
    height: 90,
    borderRadius: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 40,
    lineHeight: 90,
    color: "#fff",
  },
});
