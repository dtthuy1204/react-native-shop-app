import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Image,
    FlatList,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

//const BASE_URL = "http://192.168.1.204:3001";
const BASE_URL = "http://192.168.137.1:3001";
const screenWidth = Dimensions.get("window").width;

const AdminManagement = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [usersRes, ordersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/admin/users`),
                    axios.get(`${BASE_URL}/admin/orders`),
                ]);
                setUsers(usersRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.log("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const confirmOrder = async (orderId) => {
        try {
            await axios.put(`${BASE_URL}/admin/orders/${orderId}/confirm`);
            alert("Order confirmed and email sent!");
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, status: "Confirmed" } : order
                )
            );
        } catch (error) {
            console.log("Error confirming order:", error);
            alert("Failed to confirm order");
        }
    };
    const cancelOrder = async (orderId) => {
        try {
            await axios.put(`${BASE_URL}/admin/orders/${orderId}/cancel`);
            alert(" Order cancelled.");
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, status: "Cancelled" } : order
                )
            );
        } catch (error) {
            console.log("Error cancelling order:", error);
            alert("Failed to cancel order");
        }
    };


    if (loading)
        return (
            <ActivityIndicator
                size="large"
                color="#d63384"
                style={{ marginTop: 100 }}
            />
        );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}> Admin Management</Text>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <Pressable
                        onPress={() => setActiveTab("users")}
                        style={[
                            styles.tab,
                            activeTab === "users" && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "users" && styles.activeTabText,
                            ]}
                        >
                            Users
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setActiveTab("orders")}
                        style={[
                            styles.tab,
                            activeTab === "orders" && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "orders" && styles.activeTabText,
                            ]}
                        >
                            Orders
                        </Text>
                    </Pressable>
                </View>
            </View>

            {activeTab === "users" ? (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>{item.email}</Text>
                            <Text>{item.verified ? " Verified" : " Not Verified"}</Text>
                        </View>
                    )}
                />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.orderId}> Order: {item._id}</Text>
                            <Text style={styles.label}> Customer: {item.user?.name || "N/A"}</Text>

                            <Text style={styles.label}> Products:</Text>
                            {item.products.map((p, idx) => (
                                <View key={idx} style={styles.productRow}>
                                    <Image
                                        source={{ uri: p.image }}
                                        style={styles.productImage}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.productName}>{p.name}</Text>
                                        <Text>
                                            Quantity: {p.quantity} × ${p.price.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            ))}

                            <Text style={styles.total}>
                                Total: ${item.totalPrice.toLocaleString()}
                            </Text>

                            <Text style={styles.label}> Shipping Address:</Text>
                            <Text>
                                {item.shippingAddress.name} - {item.shippingAddress.mobileNo}
                            </Text>
                            <Text>
                                {item.shippingAddress.houseNo}, {item.shippingAddress.street},{" "}
                                {item.shippingAddress.landmark}, {item.shippingAddress.postalCode}
                            </Text>

                            <Text style={styles.label}> Payment Method:</Text>
                            <Text>{item.paymentMethod}</Text>

                            <Text style={styles.label}> Status:</Text>
                            <Text
                                style={{
                                    color:
                                        item.status === "Confirmed"
                                            ? "green"
                                            : item.status === "Pending"
                                                ? "orange"
                                                : "#333",
                                    fontWeight: "600",
                                }}
                            >
                                {item.status}
                            </Text>

                            <View style={styles.actionRow}>
                                <Pressable
                                    onPress={() => confirmOrder(item._id)}
                                    style={[
                                        styles.actionBtn,
                                        { backgroundColor: "#28a745" },
                                        item.status !== "Pending" && { backgroundColor: "#ccc" },
                                    ]}
                                    disabled={item.status !== "Pending"}
                                >
                                    <Text style={styles.btnText}>
                                        {item.status === "Confirmed" ? " Confirmed" : "Confirm"}
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => cancelOrder(item._id)}
                                    style={[
                                        styles.actionBtn,
                                        { backgroundColor: "#dc3545" },
                                        item.status !== "Pending" && { backgroundColor: "#ccc" },
                                    ]}
                                    disabled={item.status !== "Pending"}
                                >
                                    <Text style={styles.btnText}>
                                        {item.status === "Cancelled" ? " Cancelled" : "Cancel"}
                                    </Text>
                                </Pressable>
                            </View>

                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default AdminManagement;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFF8FB",
    },
    header: {
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: "#FFE6F0",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#d63384",
    },
    tabContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#f7c8dc",
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: "#d63384",
    },
    tabText: {
        color: "#333",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },
    listContainer: {
        padding: 16,
        paddingBottom: 60,
    },
    card: {
        backgroundColor: "#FFE6F0",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
    },
    name: {
        fontWeight: "600",
        fontSize: 16,
    },
    orderId: {
        fontWeight: "700",
        color: "#d63384",
        marginBottom: 6,
    },
    label: {
        fontWeight: "600",
        marginTop: 6,
    },
    productRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 8,
    },
    productName: {
        fontWeight: "500",
    },
    total: {
        marginTop: 6,
        fontWeight: "700",
        color: "#d63384",
    },
    confirmBtn: {
        marginTop: 10,
        backgroundColor: "#d63384",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
    },

});
