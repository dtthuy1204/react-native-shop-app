import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const clearOldToken = async () => {
      await AsyncStorage.removeItem("authToken");
    };
    clearOldToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Oops!", "Please fill in both email and password 💌");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      if (response?.data?.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        navigation.replace("Main");
      } else {
        Alert.alert("Login failed", "Unexpected server response");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password";
      Alert.alert("Login error", msg);
      console.log("Login failed", err?.response || err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "100%", alignItems: "center" }}
        >
          <Text style={styles.title}>Welcome Back </Text>
          <Text style={styles.subtitle}>Login to your sweet account</Text>

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

          <Pressable style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>
              Don’t have an account?{" "}
              <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5", 
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
  loginBtn: {
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
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#555",
    marginTop: 20,
    fontSize: 15,
  },
  signUpText: {
    color: "#d63384",
    fontWeight: "bold",
  },
});
