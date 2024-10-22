// Add state to store logged-in user info
const [loggedInUser, setLoggedInUser] = useState(null);

// Update the fetchData function to set logged-in user
useEffect(() => {
  async function fetchData() {
    try {
      const userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      setLoggedInUser(user); // Save the logged-in user info
      const response = await fetch("https://e35b-2402-4000-2350-2f49-1506-ffb9-ac5f-6c99.ngrok-free.app/SmartChat/LoadHomeData?id=" + user.id);

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

// Use the logged-in user to navigate to their profile
<MenuOption style={styles.menuText}>
  <Pressable
    onPress={() => {
      if (loggedInUser) {
        navigation.navigate('MyProfile', {
          userId: loggedInUser.id,
          userName: loggedInUser.first_name + " " + loggedInUser.last_name,
          userPhone: loggedInUser.mobile,
          userAvatarImage: loggedInUser.avaterImageFound ? 
            "https://your-ngrok-url/SmartChat/User_Images/" + loggedInUser.mobile + ".png" : null
        });
      } else {
        Alert.alert("Error", "User is not logged in.");
      }
    }}
  >
    <Text style={styles.menuOptionText}>My Profile</Text>
  </Pressable>
</MenuOption>
