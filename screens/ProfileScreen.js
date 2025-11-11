import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { BASE_URL } from "../config";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.log("Error fetching user profile:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${userId}`);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setUserId(null);
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD6EC" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.headerIcons}>
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#d63384"
              />
              <Feather name="search" size={24} color="#d63384" />
            </View>
          </View>

          <Text style={styles.welcomeText}>
            {loadingUser
              ? "Loading..."
              : `Welcome, ${user?.name || "lovely user"} 💕`}
          </Text>

          {user?.email === "test@example.com" && (
            <Pressable
              onPress={() => navigation.navigate("AdminManagement")}
              style={styles.managementBtn}
            >
              <Ionicons name="settings-outline" size={20} color="#d63384" />
              <Text style={styles.managementText}>Management</Text>
            </Pressable>
          )}

          <View style={styles.row}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Your orders</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate("AccountScreen")}
            >
              <Text style={styles.buttonText}>Your account</Text>
            </Pressable>

          </View>

          <View style={styles.row}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Buy again</Text>
            </Pressable>
            <Pressable
              onPress={logout}
              style={[styles.button, styles.logoutBtn]}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>Logout</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Recent Orders</Text>

          {loadingOrders ? (
            <ActivityIndicator
              size="large"
              color="#d63384"
              style={{ marginTop: 30 }}
            />
          ) : orders.length > 0 ? (
            <View style={styles.orderGrid}>
              {orders.map((order) => {
                const product = order.products[0];
                return (
                  <Pressable
                    key={order._id}
                    style={styles.orderCard}
                    onPress={() => navigation.navigate("OrderDetail", { order })}
                  >

                    <Image
                      source={{ uri: product?.image }}
                      style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={1}>
                      {product?.name}
                    </Text>
                    <Text style={styles.orderStatus}>
                      {order.status === "Confirmed"
                        ? "✅ Confirmed"
                        : "🕓 Pending"}
                    </Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noOrdersText}>No orders yet 💗</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD6EC",
  },
  container: {
    backgroundColor: "#FFF8FB",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { width: 120, height: 90, resizeMode: "contain" },
  headerIcons: { flexDirection: "row", gap: 15 },
  welcomeText: {
    fontSize: 19,
    fontWeight: "600",
    color: "#d63384",
    marginTop: 12,
    textAlign: "center",
  },
  managementBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFE0EE",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 14,
    shadowColor: "#FFB6C1",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  managementText: {
    color: "#d63384",
    fontWeight: "600",
    marginLeft: 6,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
  button: {
    flex: 1,
    padding: 14,
    backgroundColor: "#FFD6EC",
    borderRadius: 25,
    shadowColor: "#FFB6C1",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#d63384",
  },
  logoutBtn: { backgroundColor: "#d63384" },
  sectionTitle: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "700",
    color: "#d63384",
    textAlign: "center",
  },
  orderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18,
  },
  orderCard: {
    width: "48%",
    backgroundColor: "#FFF0F6",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#FFB6C1",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "contain",
  },
  productName: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#d63384",
    marginTop: 8,
  },
  orderStatus: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 4,
    color: "#7A1E57",
  },
  orderDate: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 2,
    color: "#999",
  },
  noOrdersText: {
    marginTop: 25,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
});
