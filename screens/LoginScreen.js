import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Pressable } from "react-native";

import React, { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

const LoginScreen = () => {
  const BASE_URL = "http://192.168.1.204:3001";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
  const clearOldToken = async () => {
    await AsyncStorage.removeItem("authToken");
  };
  clearOldToken();
}, []);
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");

  //       if (token) {
  //         navigation.replace("Main");
  //       }
  //     } catch (err) {
  //       console.log("error message", err);
  //     }
  //   };
  //   checkLoginStatus();
  // }, []);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Validation error", "Please fill in both email and password");
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
    Alert.alert("Login error!", msg);
    console.log("Login failed", err?.response || err);
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
      <View>
        <Image
          style={{ width: 150, height: 100 }}
          source={require("../assets/logo.png")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Login In to your Account
          </Text>
        </View>
        <View style={{ marginTop: 70 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 30
          }}>
            <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16
              }}
              placeholder="Enter your Email" />
          </View>

        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons style={{ marginLeft: 8 }} name="lock" size={24} color="gray" />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16
              }}
              placeholder="Enter your Password"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>
        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});