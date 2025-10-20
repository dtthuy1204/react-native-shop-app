import {
    StyleSheet,
    Text,
    View,
    Platform,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    FlatList,
    Dimensions, Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Feather, Ionicons, MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";

const { width } = Dimensions.get("window");
const HomeScreen = () => {
    const list = [
        {
            id: "0",
            image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
            name: "Home",
        },
        {
            id: "1",
            image:
                "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
            name: "Deals",
        },
        {
            id: "3",
            image:
                "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
            name: "Electronics",
        },
        {
            id: "4",
            image:
                "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
            name: "Mobiles",
        },
        {
            id: "5",
            image:
                "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
            name: "Music",
        },
        {
            id: "6",
            image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
            name: "Fashion",
        },
    ];
    const images = [
        "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
    ];
    const deals = [
        {
            id: "20",
            title: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)",
            oldPrice: 25000,
            price: 19000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg",
                "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
            ],
            color: "Stellar Green",
            size: "6 GB RAM 128GB Storage",
        },
        {
            id: "30",
            title:
                "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers",
            oldPrice: 74000,
            price: 26000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg",
                "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
            ],
            color: "Cloud Navy",
            size: "8 GB RAM 128GB Storage",
        },
        {
            id: "40",
            title:
                "Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger",
            oldPrice: 16000,
            price: 14000,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg",
                "https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg",
            ],
            color: "Icy Silver",
            size: "6 GB RAM 64GB Storage",
        },
        {
            id: "40",
            title:
                "realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera",
            oldPrice: 12999,
            price: 10999,
            image:
                "https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg",
                "https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg",
            ],
        },
    ];

    const offers = [
        {
            id: "0",
            title:
                "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
            offer: "72% off",
            oldPrice: 7500,
            price: 4500,
            image:
                "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
            ],
            color: "Green",
            size: "Normal",
        },
        {
            id: "1",
            title:
                "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
            offer: "40%",
            oldPrice: 7955,
            price: 3495,
            image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
            ],
            color: "black",
            size: "Normal",
        },
        {
            id: "2",
            title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
            offer: "40%",
            oldPrice: 7955,
            price: 3495,
            image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
            carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
            color: "black",
            size: "Normal",
        },
        {
            id: "3",
            title:
                "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
            offer: "40%",
            oldPrice: 24999,
            price: 19999,
            image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
            carouselImages: [
                "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
                "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
                "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
            ],
            color: "Norway Blue",
            size: "8GB RAM, 128GB Storage",
        },
    ];
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [category, setCategory] = useState("fragrances");
    const { userId, setUserId } = useContext(UserType);
    const [selectedAddress, setSelectedAddress] = useState("");
    console.log(selectedAddress)
    const [items, setItems] = useState([
        { label: "fragrances", value: "fragrances" },
        { label: "clothing", value: "clothing" },
        { label: "shoes", value: "shoes" },
        { label: "jewelry", value: "jewelry" },
        { label: "beauty", value: "beauty" },
        
    ]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://dtthuy1204.github.io/product-data/product.json");
                setProducts(response.data);
            } catch (error) {
                console.log("error message", error);
            }
        }
        fetchData();
    }, []);
    const onGenderOpen = useCallback(() => {
        setCompanyOpen(false);
    }, []);

    const cart = useSelector((state) => state.cart.cart);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId, modalVisible]);
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(
                `http://192.168.1.204:3001/addresses/${userId}`
            );
            const { addresses } = response.data;

            setAddresses(addresses);
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    console.log("Decoded token:", decodedToken);
                    setUserId(decodedToken.userId);
                }
            } catch (err) {
                console.log("Error decoding token:", err);
                Alert.alert("Error", "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);
    //   console.log("address", addresses);
    // Xử lý khi người dùng scroll giữa các ảnh
    const handleScroll = (event) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );
        setCurrentIndex(index);
    };

    return (
        <>
            <SafeAreaView style={{
                paddingTop: Platform.OS === "android" ? 40 : 0,
                flex: 1,
                backgroundColor: "white",
            }}>
                <ScrollView>
                    <View style={{
                        backgroundColor: "#00CED1",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                        <Pressable style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginHorizontal: 7,
                            gap: 10,
                            backgroundColor: "white",
                            borderRadius: 3,
                            height: 38,
                            flex: 1,
                        }}>
                            <Feather style={{ paddingLeft: 10 }} name="search" size={22} color="black" />
                            <TextInput placeholder="Search Amazon.in" />
                        </Pressable>
                        <Feather name="mic" size={24} color="black" />
                    </View>

                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            padding: 10,
                            backgroundColor: "#AFEEEE",
                        }}
                    >
                        <Ionicons name="location-outline" size={24} color="black" />

                        <Pressable>
                            {selectedAddress ? (
                                <Text>
                                    Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                                </Text>
                            ) : (
                                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                                    Add a Address
                                </Text>
                            )}
                        </Pressable>

                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                    </Pressable>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {list.map((item, index) => (
                            <Pressable
                                key={index}
                                style={{
                                    margin: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                                    source={{ uri: item.image }}
                                />

                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: 12,
                                        fontWeight: "500",
                                        marginTop: 5,
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <FlatList
                        ref={flatListRef}
                        data={images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onScroll={handleScroll}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{
                                    width: width,
                                    height: 200,
                                    resizeMode: "cover",
                                }}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    {/* Dot indicator */}
                    <View style={styles.dotContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentIndex === index ? "#13274F" : "#90A4AE" },
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
                        Trending Deals of the Week
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {deals.map((item, index) => (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("Info", {
                                        id: item.id,
                                        title: item.title,
                                        price: item?.price,
                                        carouselImages: item.carouselImages,
                                        color: item?.color,
                                        size: item?.size,
                                        oldPrice: item?.oldPrice,
                                        item: item,
                                    })
                                }
                                style={{
                                    marginVertical: 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    style={{ width: 180, height: 180, resizeMode: "contain" }}
                                    source={{ uri: item?.image }}
                                />
                            </Pressable>
                        ))}
                    </View>

                    <Text
                        style={{
                            height: 1,
                            borderColor: "#D0D0D0",
                            borderWidth: 2,
                            marginTop: 15,
                        }}
                    />

                    <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
                        Today's Deals
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {offers.map((item, index) => (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("Info", {
                                        id: item.id,
                                        title: item.title,
                                        price: item?.price,
                                        carouselImages: item.carouselImages,
                                        color: item?.color,
                                        size: item?.size,
                                        oldPrice: item?.oldPrice,
                                        item: item,
                                    })
                                }
                                style={{
                                    marginVertical: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    style={{ width: 150, height: 150, resizeMode: "contain" }}
                                    source={{ uri: item?.image }}
                                />

                                <View
                                    style={{
                                        backgroundColor: "#E31837",
                                        paddingVertical: 5,
                                        width: 130,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: "white",
                                            fontSize: 13,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Upto {item?.offer}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Text
                        style={{
                            height: 1,
                            borderColor: "#D0D0D0",
                            borderWidth: 2,
                            marginTop: 15,
                        }}
                    />

                    <View
                        style={{
                            marginHorizontal: 10,
                            marginTop: 20,
                            width: "45%",
                            marginBottom: open ? 50 : 15,
                        }}
                    >
                        <DropDownPicker
                            style={{
                                borderColor: "#B7B7B7",
                                height: 30,
                                marginBottom: open ? 120 : 15,
                            }}
                            open={open}
                            value={category} //genderValue
                            items={items}
                            setOpen={setOpen}
                            setValue={setCategory}
                            setItems={setItems}
                            placeholder="choose category"
                            placeholderStyle={styles.placeholderStyles}
                            onOpen={onGenderOpen}
                            // onChangeValue={onChange}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {products
                            ?.filter((item) => item.category === category)
                            .map((item, index) => (
                                <ProductItem item={item} key={index} />
                            ))}
                    </View>

                </ScrollView>

            </SafeAreaView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)} // xử lý nút back Android
            >
                {/* Nền mờ */}
                <Pressable
                    style={styles.backdrop}
                    onPress={() => setModalVisible(false)}
                />

                {/* Nội dung chính */}
                <View style={styles.modalContainer}>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: "500" }}>
                            Choose your Location
                        </Text>

                        <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
                            Select a delivery location to see product availability and delivery options
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {addresses?.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setSelectedAddress(item);
                                    setModalVisible(false);
                                    navigation.navigate("Address");
                                }}
                                style={[
                                    styles.addressCard,
                                    {
                                        backgroundColor:
                                            selectedAddress === item ? "#FBCEB1" : "white",
                                    },
                                ]}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                                        {item?.name}
                                    </Text>
                                    <Entypo name="location-pin" size={24} color="red" />
                                </View>

                                <Text numberOfLines={1} style={styles.textCenter}>
                                    {item?.houseNo},{item?.landmark}
                                </Text>

                                <Text numberOfLines={1} style={styles.textCenter}>
                                    {item?.street}
                                </Text>

                                <Text numberOfLines={1} style={styles.textCenter}>
                                    HaNoi, VietNam
                                </Text>
                            </Pressable>
                        ))}

                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("Address");
                            }}
                            style={styles.addAddressCard}
                        >
                            <Text style={styles.addAddressText}>
                                Add an Address or pick-up point
                            </Text>
                        </Pressable>
                    </ScrollView>

                    <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
                        <View style={styles.optionRow}>
                            <Entypo name="location-pin" size={22} color="#0066b2" />
                            <Text style={styles.optionText}>Enter a VietNam pincode</Text>
                        </View>

                        <View style={styles.optionRow}>
                            <Ionicons name="locate-sharp" size={22} color="#0066b2" />
                            <Text style={styles.optionText}>Use My Current location</Text>
                        </View>

                        <View style={styles.optionRow}>
                            <Ionicons name="earth" size={22} color="#0066b2" />
                            <Text style={styles.optionText}>Deliver outside VietNam</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    openButton: {
        marginTop: 50,
        backgroundColor: "#0066b2",
        padding: 12,
        borderRadius: 8,
        alignSelf: "center",
    },
    openText: {
        color: "white",
        fontWeight: "bold",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        width: "100%",
        height: 400,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    addressCard: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        marginRight: 15,
        marginTop: 10,
    },
    addAddressCard: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    addAddressText: {
        textAlign: "center",
        color: "#0066b2",
        fontWeight: "500",
    },
    textCenter: {
        width: 130,
        fontSize: 13,
        textAlign: "center",
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    optionText: {
        color: "#0066b2",
        fontWeight: "400",
    },
});
