import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const OrderDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#d63384" />
          </Pressable>
          <Text style={styles.title}>Order Detail</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Info</Text>
          <Text style={styles.text}>Order ID: {order._id}</Text>
          <Text style={styles.text}>
             Date: {new Date(order.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.text}>Total: ${order.totalPrice}</Text>
          <Text style={styles.text}>Status: {order.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {order.products.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetail}>Quantity: {product.quantity}</Text>
                <Text style={styles.productDetail}>Price: ${product.price}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.text}>{order.shippingAddress.name}</Text>
          <Text style={styles.text}>{order.shippingAddress.mobileNo}</Text>
          <Text style={styles.text}>
             {order.shippingAddress.houseNo}, {order.shippingAddress.street}
          </Text>
          <Text style={styles.text}>
             {order.shippingAddress.landmark}, {order.shippingAddress.postalCode}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Text style={styles.text}>Method: {order.paymentMethod}</Text>
        </View>

        <Pressable
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeBtnText}>Close</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8FB",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF8FB",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  backBtn: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d63384",
  },
  section: {
    backgroundColor: "#ffe6f2",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#b30059",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#444",
    marginVertical: 2,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
  },
  productImage: { width: 70, height: 70, borderRadius: 10 },
  productInfo: { marginLeft: 10, flex: 1 },
  productName: { fontWeight: "600", fontSize: 15, color: "#d63384" },
  productDetail: { color: "#555", fontSize: 14 },
  closeBtn: {
    backgroundColor: "#d63384",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  closeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
