import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  //const BASE_URL = "http://192.168.1.204:3001";
  const BASE_URL = "http://192.168.137.1:3001";
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validation error", "Please fill in all fields 🌷");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation error", "Invalid email format 💌");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation error", "Password must be at least 6 characters 🔒");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
      const message = response?.data?.message || "Registration successful 🎉";
      Alert.alert("Success", message);
      setName("");
      setEmail("");
      setPassword("");
      navigation.navigate("Login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed, please try again";
      Alert.alert("Registration error", msg);
      console.log("Registration failed", err?.response || err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "100%", alignItems: "center" }}
        >
          <Text style={styles.title}> Create Account </Text>
          <Text style={styles.subtitle}>Join our pinky world today!</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={22} color="#d63384" style={{ marginLeft: 8 }} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#d48fb0"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={22} color="#d63384" style={{ marginLeft: 8 }} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#d48fb0"
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={22} color="#d63384" style={{ marginLeft: 8 }} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#d48fb0"
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.keepLogin}>Keep me logged in</Text>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </View>

          <Pressable style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.signInText}>Sign In</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5", // pastel pink nền
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginTop: -20,
    width: 500,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#d63384",
    marginBottom: 5,
  },
  subtitle: {
    color: "#b76e79",
    fontSize: 15,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    marginVertical: 8,
    width: "90%",
    shadowColor: "#d48fb0",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#444",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
  },
  keepLogin: { color: "#555", fontSize: 14 },
  forgot: { color: "#d63384", fontWeight: "500" },
  registerBtn: {
    backgroundColor: "#f48fb1",
    paddingVertical: 14,
    width: "90%",
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#d63384",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  registerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#555",
    marginTop: 20,
    fontSize: 15,
  },
  signInText: {
    color: "#d63384",
    fontWeight: "bold",
  },
});
