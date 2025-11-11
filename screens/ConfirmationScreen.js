import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];

  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAdress] = useState("");
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const response = await axios.post(
        `${BASE_URL}/orders`,
        orderData
      );
      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data);
      }
    } catch (error) {
      console.log("error placing order", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={styles.stepsRow}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              {index > 0 && (
                <View
                  style={[
                    styles.stepLine,
                    index <= currentStep && { backgroundColor: "#d63384" },
                  ]}
                />
              )}
              <View
                style={[
                  styles.stepCircle,
                  index <= currentStep && { backgroundColor: "#d63384" },
                ]}
              >
                {index < currentStep ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Delivery Address</Text>

          {addresses?.map((item, index) => (
            <Pressable key={index} style={styles.addressCard}>
              {selectedAddress && selectedAddress._id === item._id ? (
                <FontAwesome5 name="dot-circle" size={20} color="#d63384" />
              ) : (
                <Entypo
                  onPress={() => setSelectedAdress(item)}
                  name="circle"
                  size={20}
                  color="gray"
                />
              )}

              <View style={{ marginLeft: 6, flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Text style={styles.addressName}>{item?.name}</Text>
                  <Entypo name="location-pin" size={20} color="#d63384" />
                </View>

                <Text style={styles.addressText}>
                  {item?.houseNo}, {item?.landmark}
                </Text>
                <Text style={styles.addressText}>{item?.street}</Text>
                <Text style={styles.addressText}>HaNoi, VietNam</Text>
                <Text style={styles.addressText}>Phone: {item?.mobileNo}</Text>
                <Text style={styles.addressText}>Pin: {item?.postalCode}</Text>

                {selectedAddress && selectedAddress._id === item._id && (
                  <Pressable
                    onPress={() => setCurrentStep(1)}
                    style={styles.pinkButton}
                  >
                    <Text style={styles.whiteText}>Deliver to this Address</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {currentStep === 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your delivery option</Text>

          <Pressable
            onPress={() => setOption(!option)}
            style={styles.optionBox}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={20} color="#d63384" />
            ) : (
              <Entypo name="circle" size={20} color="gray" />
            )}
            <Text style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ color: "#d63384", fontWeight: "600" }}>
                Tomorrow by 10pm
              </Text>{" "}
              - Free delivery with Prime
            </Text>
          </Pressable>

          <Pressable onPress={() => setCurrentStep(2)} style={styles.pinkButton}>
            <Text style={styles.whiteText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select your payment method</Text>

          <Pressable
            onPress={() => setSelectedOption("cash")}
            style={styles.optionBox}
          >
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#d63384" />
            ) : (
              <Entypo name="circle" size={20} color="gray" />
            )}
            <Text style={styles.optionText}>Cash on Delivery</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedOption("card")}
            style={styles.optionBox}
          >
            {selectedOption === "card" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#d63384" />
            ) : (
              <Entypo name="circle" size={20} color="gray" />
            )}
            <Text style={styles.optionText}>Credit or Debit Card</Text>
          </Pressable>

          <Pressable onPress={() => setCurrentStep(3)} style={styles.pinkButton}>
            <Text style={styles.whiteText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryBox}>
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Items</Text>
              <Text style={styles.grayText}>${total}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Delivery</Text>
              <Text style={styles.grayText}>$0</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
          </View>

          <View style={styles.paymentBox}>
            <Text style={styles.grayText}>Pay With</Text>
            <Text style={styles.paymentText}>Pay on delivery (Cash)</Text>
          </View>

          <Pressable onPress={handlePlaceOrder} style={styles.pinkButton}>
            <Text style={styles.whiteText}>Place your order 💖</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
    paddingTop: 55,
  },
  stepContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepLine: {
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#f8bbd0",
    zIndex: -1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8bbd0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: { color: "white", fontWeight: "bold" },
  checkMark: { color: "white", fontWeight: "bold", fontSize: 16 },
  stepTitle: { marginTop: 8, color: "#d63384", fontWeight: "500" },

  section: { marginHorizontal: 20, marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d63384",
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#f8bbd0",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#f8bbd0",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addressName: { fontSize: 15, fontWeight: "bold", color: "#d63384" },
  addressText: { fontSize: 14, color: "#5a4a4a" },

  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f8bbd0",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  optionText: { marginLeft: 8, color: "#d63384", fontWeight: "500" },

  pinkButton: {
    backgroundColor: "#d63384",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
  whiteText: { color: "white", fontWeight: "bold" },

  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    padding: 10,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  grayText: { color: "#6b5b5b" },
  totalLabel: { fontWeight: "bold", fontSize: 16, color: "#d63384" },
  totalValue: { fontWeight: "bold", fontSize: 16, color: "#d63384" },

  paymentBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    padding: 10,
    marginTop: 10,
  },
  paymentText: { marginTop: 4, color: "#d63384", fontWeight: "600" },
});
