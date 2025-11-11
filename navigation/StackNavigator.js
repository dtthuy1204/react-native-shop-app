import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import AdminManagement from "../screens/AdminManagement";
import AccountScreen from "../screens/AccountScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFD6EC",
            borderTopWidth: 0,
            height: 65,
            shadowColor: "#FFB6C1",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 6,
            elevation: 6,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={26} color="#d63384" />
              ) : (
                <AntDesign name="home" size={24} color="#7A1E57" />
              ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="shopping-cart" size={26} color="#d63384" />
              ) : (
                <AntDesign name="shopping-cart" size={24} color="#7A1E57" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={26} color="#d63384" />
              ) : (
                <Ionicons name="person-outline" size={24} color="#7A1E57" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFF0F6" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="Info" component={ProductInfoScreen} />
        <Stack.Screen name="Address" component={AddAddressScreen} />
        <Stack.Screen name="Add" component={AddressScreen} />
        <Stack.Screen name="Confirm" component={ConfirmationScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="AdminManagement" component={AdminManagement} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  tabLabel: {
    color: "#d63384",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 4,
  },
});
