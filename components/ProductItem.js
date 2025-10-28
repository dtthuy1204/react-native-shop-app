import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("Info", {
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category,
          rating: item.rating,
          carouselImages: [item.image],
          color: "None",
          size: "N/A",
          item: item,
        })
      }
    >
      <Image style={styles.image} source={{ uri: item?.image }} />

      <Text numberOfLines={2} style={styles.title}>
        {item?.title}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.price}>${item?.price}</Text>
        <Text style={styles.rating}>{item?.rating?.rate}★</Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          addItemToCart(item);
        }}
        style={[
          styles.button,
          addedToCart ? styles.buttonAdded : styles.buttonDefault,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            addedToCart ? styles.textAdded : styles.textDefault,
          ]}
        >
          {addedToCart ? "💗 Added!" : "Add to Cart"}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 10,
    backgroundColor: "#ffe6f2",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#ff99cc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    width: 165,
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    borderRadius: 15,
  },
  title: {
    width: 150,
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#5a0033",
  },
  infoRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e75480",
  },
  rating: {
    color: "#ff80bf",
    fontWeight: "600",
  },
  button: {
    paddingVertical: 8,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "90%",
  },
  buttonDefault: {
    backgroundColor: "#ffb6c1",
  },
  buttonAdded: {
    backgroundColor: "#fce4ec",
    borderWidth: 1,
    borderColor: "#ff80bf",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  textDefault: {
    color: "#fff",
  },
  textAdded: {
    color: "#ff80bf",
  },
});
