import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png" }}
        style={styles.image}
      />

      <Text style={styles.text}>Your Order Has Been Received</Text>

      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png" }}
        style={styles.sparkle}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },
  sparkle: {
    height: 80,
    width: 80,
    marginTop: 20,
  },
});
