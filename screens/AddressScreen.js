import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";

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

  // Lấy userId từ token khi vào màn hình
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

  // Hiển thị màn hình loading nếu user chưa sẵn sàng
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  //  Hàm xử lý thêm địa chỉ
  const handleAddAddress = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "User not loaded yet, please try again");
        return;
      }

      // Kiểm tra dữ liệu nhập vào
      if (!name || !mobileNo || !houseNo || !street || !postalCode) {
        Alert.alert("Validation error", "Please fill in all required fields");
        return;
      }

      const address = {
        name,
        mobileNo,
        houseNo,
        street,
        landmark,
        postalCode,
      };

      const response = await axios.post("http://192.168.1.204:3001/addresses", {
        userId,
        address,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Address added successfully");

        // Reset form
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");

        // Quay lại sau 0.5s
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert("Error", "Unexpected server response");
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.log("Error adding address:", error?.response || error);
      const message =
        error?.response?.data?.message ||
        "Failed to add address. Please try again.";
      Alert.alert("Error", message);
    }
  };

  //  Giao diện
  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: "#00CED1" }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Add a new Address
        </Text>

        <TextInput
          placeholderTextColor={"black"}
          placeholder="VietNam"
          style={styles.input}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Enter your name"
          />
        </View>

        <View>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Flat, House No, Building, Company</Text>
          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Enter address details"
          />
        </View>

        <View>
          <Text style={styles.label}>Area, Street, Sector, Village</Text>
          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Enter street"
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Landmark (optional)"
          />
        </View>

        <View>
          <Text style={styles.label}>Pin-Code</Text>
          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor={"black"}
            style={styles.input}
            placeholder="Enter Pin-Code"
            keyboardType="numeric"
          />
        </View>

        <Pressable onPress={handleAddAddress} style={styles.button}>
          <Text style={{ fontWeight: "bold" }}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFC72C",
    padding: 19,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
