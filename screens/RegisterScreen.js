import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from "react-native";

import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const BASE_URL = "http://192.168.1.204:3001";

  const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert("Validation error", "Please fill in all fields");
    return;
  }
  // basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Validation error", "Invalid email format");
    return;
  }
  if (password.length < 6) {
    Alert.alert("Validation error", "Password must be at least 6 characters");
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
    const message = response?.data?.message || "Registration successful";
    Alert.alert("Success", message);
    setName("");
    setEmail("");
    setPassword("");
  } catch (err) {
    const msg = err?.response?.data?.message || "Registration failed, please try again";
    Alert.alert("Registration error", msg);
    console.log("Registration failed", err?.response || err);
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
                Register to your Account
              </Text>
            </View>
            <View style={{ marginTop: 70 }}>
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
                <MaterialIcons style={{ marginLeft: 8 }} name="person" size={24} color="gray" />
    
                <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 16 : 16,
              }}
              placeholder="Enter your Name"
            />
            </View>
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
             onPress={handleRegister}
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
                Register
              </Text>
            </Pressable>
            
            <Pressable
            onPress={() => navigation.goBack()}
              style={{ marginTop: 15 }}
            >
              <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
                Already Have an account? Sign In
              </Text>
            </Pressable>
    
          </KeyboardAvoidingView>
    
        </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});