import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserType } from "../UserContext";

const BASE_URL = "http://192.168.1.204:3001";

const AccountScreen = () => {
  const { userId } = useContext(UserType);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleRequestOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/request-password-reset`, {
        email: emailForReset,
      });
      setOtpSent(true);
      Alert.alert("📩 OTP Sent", "Please check your email for the OTP code.");
    } catch (error) {
      console.log("Error sending OTP:", error);
      Alert.alert("❌ Error", "Failed to send OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/verify-otp-reset`, {
        email: emailForReset,
        otp,
        newPassword,
      });
      Alert.alert("✅ Success", "Password has been reset successfully!");
      setShowReset(false);
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
    } catch (error) {
      console.log("Error verifying OTP:", error);
      Alert.alert("❌ Error", "Invalid OTP or request expired.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d63384" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Your Account</Text>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {showReset ? (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Reset Password</Text>

              <TextInput
                style={[styles.input, { backgroundColor: "#FCE4EC" }]}
                value={emailForReset}
                onChangeText={setEmailForReset}
                placeholder="Enter your email"
                autoCapitalize="none"
              />

              {!otpSent ? (
                <Pressable
                  style={[styles.button, styles.saveBtn]}
                  onPress={handleRequestOTP}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                </Pressable>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                  />
                  <Pressable
                    style={[styles.button, styles.saveBtn]}
                    onPress={handleVerifyOTP}
                  >
                    <Text style={styles.buttonText}>Confirm Reset</Text>
                  </Pressable>
                </>
              )}

              <Pressable
                style={[styles.button, styles.cancelBtn, { marginTop: 10 }]}
                onPress={() => {
                  setShowReset(false);
                  setOtpSent(false);
                }}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user?.name}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>

              <Text style={styles.label}>Addresses</Text>
              {user?.addresses?.length ? (
                user.addresses.map((addr, idx) => (
                  <View key={idx} style={styles.addressBox}>
                    <Text>{addr.name}</Text>
                    <Text>{addr.houseNo + ", " + addr.street}</Text>
                    <Text>{addr.city + ", " + addr.country}</Text>
                    <Text>Postal Code: {addr.postalCode}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No address added yet.</Text>
              )}

              <Pressable
                style={[styles.button, styles.saveBtn, { marginTop: 10 }]}
                onPress={() => {
                  setEmailForReset(user?.email);
                  setShowReset(true);
                }}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8FB",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#d63384",
    textAlign: "center",
    marginVertical: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFD6EC",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d63384",
    marginTop: 10,
  },
  userEmail: {
    color: "#7A1E57",
    fontSize: 14,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#FFB6C1",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    color: "#d63384",
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FFE4F1",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  addressBox: {
    backgroundColor: "#FFF0F7",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyText: {
    color: "#777",
    fontStyle: "italic",
    marginTop: 6,
  },
  formContainer: {
    marginTop: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD6EC",
    marginBottom: 10,
    color: "#333",
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#FFD6EC",
  },
  cancelBtn: {
    backgroundColor: "#d63384",
  },
  buttonText: {
    color: "#d63384",
    fontWeight: "600",
  },
});
