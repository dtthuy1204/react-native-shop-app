import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userId);
        }
      } catch (err) {
        console.log("Error decoding token:", err);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#d63384", fontSize: 16 }}>Loading user data...</Text>
      </View>
    );
  }

  const handleAddAddress = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "User not loaded yet, please try again");
        return;
      }

      if (!name || !mobileNo || !houseNo || !street || !postalCode) {
        Alert.alert("Validation error", "Please fill in all required fields");
        return;
      }

      const address = { name, mobileNo, houseNo, street, landmark, postalCode };

      const response = await axios.post("http://192.168.1.204:3001/addresses", {
        userId,
        address,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Address added successfully");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");

        setTimeout(() => navigation.goBack(), 500);
      } else {
        Alert.alert("Error", "Unexpected server response");
      }
    } catch (error) {
      console.log("Error adding address:", error);
      Alert.alert("Error", "Failed to add address. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF0F5",
        paddingTop: Platform.OS === "android" ? 40 : 0,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <Text style={styles.headerText}>🏠 Add a New Address</Text>

        {/* Country */}
        <TextInput
          placeholder="Viet Nam"
          placeholderTextColor="#d48fb0"
          style={styles.input}
        />

        {/* Name */}
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#f2a4be"
            style={styles.input}
          />
        </View>

        {/* Phone */}
        <View>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholder="Enter phone number"
            placeholderTextColor="#f2a4be"
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        {/* House No */}
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Flat / House No. / Building</Text>
          <TextInput
            value={houseNo}
            onChangeText={setHouseNo}
            placeholder="Enter house or building info"
            placeholderTextColor="#f2a4be"
            style={styles.input}
          />
        </View>

        {/* Street */}
        <View>
          <Text style={styles.label}>Street / Area / Village</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street"
            placeholderTextColor="#f2a4be"
            style={styles.input}
          />
        </View>

        {/* Landmark */}
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Landmark (optional)</Text>
          <TextInput
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Near school, mall, etc."
            placeholderTextColor="#f2a4be"
            style={styles.input}
          />
        </View>

        {/* Postal Code */}
        <View>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Enter postal code"
            placeholderTextColor="#f2a4be"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* Button */}
        <Pressable onPress={handleAddAddress} style={styles.button}>
          <Text style={styles.buttonText}>💖 Add Address</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d63384",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d63384",
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderColor: "#f8bbd0",
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: "#fff",
    color: "#d63384",
  },
  button: {
    backgroundColor: "#d63384",
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#d63384",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
