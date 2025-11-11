import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const images =
    route.params?.carouselImages?.length > 0
      ? route.params.carouselImages
      : [route.params?.image];

  const color = route.params?.color || "Default";
  const size = route.params?.size || "Standard";

  const rating =
    typeof route.params?.rating === "object"
      ? route.params.rating.rate
      : route.params?.rating || "N/A";

  const description = route.params?.description || "No description available.";

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff0f6",
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.searchBarContainer}>
          <Pressable style={styles.searchBar}>
            <Feather
              style={{ paddingLeft: 10 }}
              name="search"
              size={22}
              color="#d63384"
            />
            <TextInput
              placeholder="Search your favorite products..."
              placeholderTextColor="#f5b7c4"
              style={{ color: "#d63384", flex: 1 }}
            />
          </Pressable>
          <Feather name="mic" size={24} color="#d63384" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((item, index) => (
            <ImageBackground
              key={index}
              style={styles.productImage}
              source={{ uri: item }}
            >
              <View style={styles.imageTopIcons}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>20% off</Text>
                </View>

                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={24}
                    color="#d63384"
                  />
                </View>
              </View>

              <View style={styles.iconCircleBottom}>
                <Feather name="heart" size={24} color="#d63384" />
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{route.params?.title}</Text>
          <Text style={styles.productPrice}>${route.params?.price}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Color:</Text>
          <Text style={styles.detailValue}>{color}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>{size}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rating:</Text>
          <Text style={styles.detailValue}>{rating} ★</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.deliveryContainer}>
          <Text style={styles.totalPrice}>Total: ${route.params.price}</Text>
          <Text style={styles.freeDelivery}>
            💖 Free 1-day shipping! Order in 10 hours!
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={22} color="#d63384" />
            <Text style={styles.locationText}>
              Product shipped directly from our official store
            </Text>
          </View>
        </View>

        <Text style={styles.inStock}>IN STOCK </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Product Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <Pressable
          onPress={() => addItemToCart(route.params?.item)}
          style={[
            styles.button,
            addedToCart ? styles.buttonAdded : styles.buttonAdd,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              addedToCart ? styles.textAdded : styles.textAdd,
            ]}
          >
            {addedToCart ? " Added to cart" : "Add to cart"}
          </Text>
        </Pressable>

        <Pressable style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Buy now </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: "#ffe4ec",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
    flex: 1,
    shadowColor: "#f8a1c4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  productImage: {
    width: Dimensions.get("window").width,
    height: 380,
    marginTop: 20,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  imageTopIcons: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountBadge: {
    width: 60,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#d63384",
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd6e8",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleBottom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd6e8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginLeft: 20,
    marginBottom: 20,
  },
  productInfo: { padding: 15 },
  productTitle: { fontSize: 18, fontWeight: "700", color: "#d63384" },
  productPrice: { fontSize: 22, fontWeight: "bold", color: "#d63384" },
  separator: { height: 1, borderColor: "#ffd6e8", borderWidth: 1, marginVertical: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginVertical: 5 },
  detailLabel: { color: "#d63384", fontSize: 16 },
  detailValue: { fontSize: 16, fontWeight: "bold", color: "#d63384", marginLeft: 5 },
  deliveryContainer: { padding: 15 },
  totalPrice: { fontSize: 17, fontWeight: "700", marginVertical: 5, color: "#d63384" },
  freeDelivery: { color: "#d63384", fontSize: 14 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 5 },
  locationText: { fontSize: 15, color: "#d63384", fontWeight: "500" },
  inStock: { color: "green", marginHorizontal: 15, fontWeight: "600", marginTop: 8 },
  descriptionContainer: {
    marginTop: 15,
    backgroundColor: "#ffe4ec",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    shadowColor: "#f5a8c3",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  descriptionTitle: {
    color: "#d63384",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  descriptionText: {
    color: "#6b004f",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  button: {
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#f3aac2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonAdd: { backgroundColor: "#ffb6c1" },
  buttonAdded: { backgroundColor: "#fff0f5", borderWidth: 1, borderColor: "#d63384" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  textAdd: { color: "white" },
  textAdded: { color: "#d63384" },
  buyNowButton: {
    backgroundColor: "#d63384",
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    shadowColor: "#d63384",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buyNowText: { color: "white", fontWeight: "700", fontSize: 17 },
});