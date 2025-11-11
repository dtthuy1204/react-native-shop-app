import { StyleSheet, Text, View, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        }}
        style={[
          styles.image,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        🎉 Your Order Has Been Received 💕
      </Animated.Text>

      <Animated.Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        }}
        style={[
          styles.sparkle,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5", 
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 25,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#d63384", 
    marginHorizontal: 20,
  },
  sparkle: {
    height: 80,
    width: 80,
    marginTop: 25,
    tintColor: "#f8bbd0", 
  },
});
