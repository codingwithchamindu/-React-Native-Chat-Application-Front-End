import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Image, StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [chatArray, setChatArray] = useState([]);
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

  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  console.log(loggedInUser);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredChats = chatArray.filter((item) =>
    item.other_user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(loggedInUser);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);
        setLoggedInUser(user);
        const response = await fetch("https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/LoadHomeData?id=" + user.id);

        if (response.ok) {
          const json = await response.json();
          const chatArray = JSON.parse(json.jsonChatItemArray);
          setChatArray(chatArray);
        } else {
          console.log("Response not ok");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <MenuProvider>
      <LinearGradient style={styles.MainView} colors={['#dcdcdc', '#f5f5f5', '#f0f0f0']}>
        <StatusBar hidden={true} />

        <View style={styles.header}>
          <Text style={styles.text7}>Chatty Messenger</Text>
          <Menu>
            <MenuTrigger>
              <MaterialIcons name="more-vert" size={24} color="black" />
            </MenuTrigger>

            <MenuOptions>

              {/* {filteredChats.map((item) => (
                <MenuOption key={item.other_user_id} style={styles.menuText}>
                  <Pressable
                    onPress={() => navigation.navigate('MyProfile', {
                      // userId: item.other_user_id,
                       userName: item.other_user_name,
                      userPhone: item.other_user_mobile,
                      userAvatarImage: item.avaterImageFound ? 
                        "https://e35b-2402-4000-2350-2f49-1506-ffb9-ac5f-6c99.ngrok-free.app/SmartChat/User_Images/" + item.other_user_mobile + ".png" : null
                    })}
                  >
                    <Text>My Profile</Text>
                  </Pressable>
                </MenuOption>
              ))} */}


              <MenuOption style={styles.menuText}>
                <Pressable
                  onPress={() => {
                    if (loggedInUser) {

                      navigation.navigate('MyProfile', {
                        userId: loggedInUser.id,
                        userName: loggedInUser.first_name + " " + loggedInUser.last_name,
                        userPhone: loggedInUser.mobile,

                        userAvatarImage: (loggedInUser.avaterImageFound === true )?
                          "https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/User_Images/" + loggedInUser.mobile + ".png" : null
                      }

                      );
                    } else {
                      Alert.alert("Error", "User is not logged in.");

                    }
                  }}
                >
                  <Text style={styles.menuOptionText}>My Profile</Text>
                </Pressable>
              </MenuOption>


              <MenuOption style={styles.menuText}>
                <Text style={styles.menuOptionText}>Calls</Text>
              </MenuOption>
              <MenuOption style={styles.menuText}>
                <Text style={styles.menuOptionText}>Settings</Text>
              </MenuOption>
              <MenuOption style={styles.menuText}>
                <Pressable onPress={() => {
                  AsyncStorage.clear()
                  navigation.navigate('SignIn')
                }}>
                  <Text style={styles.menuOptionText}>Logout</Text>
                </Pressable>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={handleSearch}
        />

        <FlashList
          data={filteredChats}
          renderItem={({ item }) => (
            <View>
              <Pressable style={styles.view5} onPress={() => navigation.navigate("Chat", {
                other_user_id: item.other_user_id,
                other_user_name: item.other_user_name,
                avaterImageFound: item.avaterImageFound,
                other_user_mobile: item.other_user_mobile,
                other_user_status: item.other_user_status,
              })}>
                <View style={item.other_user_status == 1 ? styles.view6Green : styles.view6Gray}>
                  {
                    (item.avaterImageFound === true) ?
                      <Image
                        source={{ uri: "https://817b-2402-4000-20c3-9a4f-c5b5-4c9b-9e71-f08b.ngrok-free.app/ChattyMessenger/User_Images/" + item.other_user_mobile + ".png" }}
                        style={styles.avatarImage}
                      />
                      :
                      <Text style={styles.text4}>{item.other_user_aveter_leters}</Text>
                  }
                </View>
                <View style={styles.view7}>
                  <Text style={styles.text4}>{item.other_user_name}</Text>
                  <Text style={styles.text5} numberOfLines={1}>{item.message}</Text>
                  <View style={styles.view8}>
                    <Text style={styles.text6}>{item.dateTime}</Text>
                    <FontAwesome6
                      name="check"
                      color={item.chat_status_id === 1 ? "green" : "red"}
                      size={18}
                      style={styles.timeText}
                    />
                  </View>
                </View>
              </Pressable>
            </View>
          )}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.other_user_id.toString()}
        />
      </LinearGradient>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
  view5: {
    flexDirection: "row",
    marginVertical: 10,
    columnGap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  view6Green: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: "#fff",
    borderColor: "#44f50f",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  view6Gray: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  text4: {
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    fontWeight: "bold",
  },
  text5: {
    fontSize: 15,
  },
  view7: {
    flex: 1,
    rowGap: 5,
  },
  view8: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
  },
  text6: {
    fontSize: 14,
    color: "#004E74",
    alignSelf: "flex-end",
  },
  text7: {
    fontSize: 25,
    paddingBottom: 25,
    paddingTop: 25,
    fontFamily: "Nunito-Medium",
    fontWeight: "bold",
    color: "#004E74",
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderColor: '#004E74',
    borderWidth: 1.4,
    marginBottom: 15,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  menuText: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  menuOptionText: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
});
