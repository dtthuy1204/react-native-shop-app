import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../config";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/addresses/${userId}`);
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchAddresses();
      }
    }, [userId])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Pressable style={styles.searchInput}>
            <Feather
              style={{ paddingLeft: 10 }}
              name="search"
              size={22}
              color="#d63384"
            />
            <TextInput
              placeholder="Search your saved addresses..."
              placeholderTextColor="#f2a4be"
              style={{ color: "#d63384", flex: 1 }}
            />
          </Pressable>
          <Feather name="mic" size={24} color="#d63384" />
        </View>

        <View style={{ padding: 15 }}>
          <Text style={styles.headerText}>🏠 Your Saved Addresses</Text>

          <Pressable
            onPress={() => navigation.navigate("Add")}
            style={styles.addNewBox}
          >
            <Text style={styles.addNewText}>Add a New Address</Text>
            <MaterialIcons name="keyboard-arrow-right" size={26} color="#d63384" />
          </Pressable>

          {addresses?.length === 0 ? (
            <Text style={styles.noAddress}>You haven’t added any address yet 💖</Text>
          ) : (
            addresses.map((item, index) => (
              <View key={index} style={styles.addressCard}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Text style={styles.addressName}>{item?.name}</Text>
                  <Entypo name="location-pin" size={22} color="#d63384" />
                </View>

                <Text style={styles.addressText}>
                  {item?.houseNo}, {item?.landmark}
                </Text>
                <Text style={styles.addressText}>{item?.street}</Text>
                <Text style={styles.addressText}>Ha Noi, Viet Nam</Text>
                <Text style={styles.addressText}>📞 {item?.mobileNo}</Text>
                <Text style={styles.addressText}>📬 {item?.postalCode}</Text>

                <View style={styles.actionRow}>
                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>

                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionText}>Remove</Text>
                  </Pressable>

                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionText}>Set Default</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
  },
  searchBar: {
    backgroundColor: "#f8bbd0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 15,
    height: 40,
    flex: 1,
    shadowColor: "#f8bbd0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d63384",
    textAlign: "center",
    marginBottom: 10,
  },
  addNewBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffe4ec",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  addNewText: {
    color: "#d63384",
    fontSize: 16,
    fontWeight: "600",
  },
  noAddress: {
    textAlign: "center",
    marginTop: 20,
    color: "#d48fb0",
    fontSize: 15,
    fontStyle: "italic",
  },
  addressCard: {
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    padding: 15,
    marginVertical: 8,
    shadowColor: "#d63384",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#d63384",
  },
  addressText: {
    fontSize: 14,
    color: "#a84e74",
    marginVertical: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#ffd6e8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5b7c5",
  },
  actionText: {
    color: "#d63384",
    fontWeight: "600",
  },
});
