import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import React from "react";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const increaseQuantity = (item) => dispatch(incementQuantity(item));
  const decreaseQuantity = (item) => dispatch(decrementQuantity(item));
  const deleteItem = (item) => dispatch(removeFromCart(item));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.searchContainer}>
          <Feather
            style={{ paddingLeft: 10 }}
            name="search"
            size={22}
            color="#d63384"
          />
          <TextInput
            placeholder="Search in your cart..."
            placeholderTextColor="#f5c0d0"
            style={{ color: "#d63384", flex: 1 }}
          />
        </Pressable>
        <Feather name="mic" size={24} color="#d63384" style={{ marginLeft: 10 }} />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Subtotal:</Text>
        <Text style={styles.totalPrice}> ${total.toFixed(2)}</Text>
      </View>
      <Text style={styles.emiText}>💖 EMI details available</Text>

      <Pressable
        onPress={() => navigation.navigate("Confirm")}
        style={styles.buyButton}
      >
        <Text style={styles.buyButtonText}>
          Proceed to Buy ({cart.length}) items
        </Text>
      </Pressable>

      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        {cart?.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.itemContainer}>
              <Image style={styles.productImage} source={{ uri: item?.image }} />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text numberOfLines={2} style={styles.productTitle}>
                  {item?.title}
                </Text>
                <Text style={styles.productPrice}>${item?.price}</Text>
                <Text style={styles.stockText}>In Stock 💕</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <View style={styles.quantityBox}>
                {item.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={styles.qtyBtn}
                  >
                    <AntDesign name="minus" size={20} color="#d63384" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={styles.qtyBtn}
                  >
                    <MaterialIcons name="delete" size={20} color="#d63384" />
                  </Pressable>
                )}

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={styles.qtyBtn}
                >
                  <Feather name="plus" size={20} color="#d63384" />
                </Pressable>
              </View>

              <Pressable onPress={() => deleteItem(item)} style={styles.deleteBtn}>
                <Text style={{ color: "#d63384", fontWeight: "600" }}>
                  Delete
                </Text>
              </Pressable>
            </View>

            <View style={styles.bottomRow}>
              <Pressable style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Save For Later</Text>
              </Pressable>
              <Pressable style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>See More Like This</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    flex: 1,
    backgroundColor: "#FFF0F5",
  },
  header: {
    backgroundColor: "#f8bbd0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    height: 40,
    flex: 1,
    shadowColor: "#f8bbd0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  totalText: { fontSize: 18, color: "#d63384", fontWeight: "500" },
  totalPrice: { fontSize: 20, fontWeight: "bold", color: "#d63384" },
  emiText: { marginLeft: 15, color: "#a84e74", marginTop: 4 },
  buyButton: {
    backgroundColor: "#d63384",
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: "#d63384",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buyButtonText: {
    fontWeight: "700",
    color: "white",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    shadowColor: "#d63384",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: 15,
    color: "#d63384",
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d63384",
    marginTop: 4,
  },
  stockText: { color: "green", marginTop: 4 },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe4ec",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f5b7c5",
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyText: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#d63384",
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#f8bbd0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff0f5",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#f8bbd0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffd6e8",
  },
  secondaryText: {
    color: "#d63384",
    fontWeight: "600",
  },
});
