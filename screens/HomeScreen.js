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
    Dimensions,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Feather, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
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
            id: "1",
            image: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2025/02/nuoc-hoa-nu-ysl-yves-saint-laurent-libre-flowers-flames-florale-edp-90ml-67b6e0dd6de7a-20022025145925.jpg",
            name: "Fragrances",
            category: "fragrances",
        },
        {
            id: "2",
            image: "https://image.hm.com/assets/hm/a3/df/a3df6e57fb16bc41c4e1519154f270d778dec9fc.jpg?imwidth=564",
            name: "Clothing",
            category: "clothing",
        },
        {
            id: "3",
            image: "https://down-vn.img.susercontent.com/file/sg-11134201-7qvd3-lex05g8v5sxa7f",
            name: "Shoes",
            category: "shoes",
        },
        {
            id: "4",
            image: "https://i.etsystatic.com/9134559/r/il/93a298/6236287204/il_1080xN.6236287204_r70v.jpg",
            name: "Jewelry",
            category: "jewelry",
        },
        {
            id: "5",
            image: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2022/12/son-dior-addict-lip-maximizer-009-intense-rosewood-mau-hong-dat-moi-nhat-2022-63ae8817888b4-30122022134127.jpg",
            name: "Beauty",
            category: "beauty",
        },
    ];

    const images = [
        "https://images.preview.ph/preview/resize/images/2020/11/25/perfumes-nm.webp",
        "https://th.bing.com/th/id/R.cd925b1777454971473e21e816e1bfe8?rik=wuSfi%2fcyyhxNrQ&riu=http%3a%2f%2fwww.yesstyle.com%2fblog%2fwp-content%2fuploads%2f2023%2f09%2fff_fb3.png&ehk=3CWeGLueJQ%2ffmFM08OXktg%2bhu0HNeBeCs1ZWVXnlXDE%3d&risl=&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/R.c92fbe2189d7297612fa2d9bedc371c2?rik=NRyn87dIm0%2fcKA&riu=http%3a%2f%2frayoungtek.com%2fcdn%2fshop%2farticles%2f20230802180630.jpg%3fv%3d1690971050&ehk=Su9SD4GkU2iDu47cwEW9bPzfPWhaLu8X4w3tGB8cv%2bk%3d&risl=&pid=ImgRaw&r=0",
    ];

    const deals = [
        {
            id: "20",
            title: "Romantic Rose Perfume 50ml",
            oldPrice: 28.43,
            price: 19.68,
            image: "https://i.pinimg.com/736x/f4/f9/06/f4f906f134ff4f1300fe72f79ffbeef1.jpg",
            carouselImages: [
                "https://i.pinimg.com/736x/c9/9c/7a/c99c7aa67f10af3cab7d6aff016bcfc0.jpg",
                "https://i.pinimg.com/736x/fb/36/47/fb364754b02eea7e559e4acc6d64280e.jpg",
                "https://i.pinimg.com/1200x/a6/4e/52/a64e52ded379e4ab2b42c1a322f322ec.jpg"
            ],
            color: "Rose Pink",
            size: "50ml",
        },
        {
            id: "30",
            title: "Floral Dress - Pastel Pink",
            oldPrice: 38.93,
            price: 30.18,
            image: "https://pinkfloraldress.com/wp-content/uploads/2025/01/kf-S3ca68f35caba41fca407ab901e0f0e63b.webp",
            carouselImages: [
                "https://pinkfloraldress.com/wp-content/uploads/2025/01/kf-S4e44500a75804095b4e9d471869ff1796-768x768.webp",
                "https://pinkfloraldress.com/wp-content/uploads/2025/01/kf-Sa191d65a006e45afb6fe10915c92d16cg-768x768.webp",
                "https://pinkfloraldress.com/wp-content/uploads/2025/01/kf-Sfa9730d64dfe4ae398e97831e9cccbed7-768x768.webp"
            ],
            color: "Pastel Pink",
            size: "M / L",
        },
        {
            id: "40",
            title: "Cute Ribbon Shoes",
            oldPrice: 24.06,
            price: 18.37,
            image: "https://i.pinimg.com/1200x/6a/54/60/6a5460edd951e2a5729815fc40294cdb.jpg",
            carouselImages: [
                "https://i.pinimg.com/1200x/18/85/21/188521cd5398afdba99881d41e258fa6.jpg",
                "https://i.pinimg.com/1200x/8e/b1/e0/8eb1e06edad6f1a8874c59f1d211a5b4.jpg",
                "https://i.pinimg.com/736x/79/f1/6a/79f16ae43e5b50f6b5063f5b461eddde.jpg"
            ],
            color: "Cream Pink",
            size: "36 - 39",
        },
    ];

    const offers = [
        {
            id: "1",
            title: "Heart Earrings Silver",
            offer: "30% off",
            oldPrice: 12.68,
            price: 8.70,
            image: "https://i.ebayimg.com/images/g/MkUAAOSwj5NmK3TN/s-l1600.webp",
        },
        {
            id: "2",
            title: "Rouge Allure Velvet Les Perles",
            offer: "25% off",
            oldPrice: 30.18,
            price: 22.74,
            image: "https://www.chanel.com/images//t_one//w_0.38,h_0.38,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_1020/rouge-allure-velvet-les-perles-luminous-matte-lip-colour-447-naturelle-0-12oz--packshot-default-151447-9551632793630.jpg",
        },
        {
            id: "3",
            title: "Pastel Nail Polish Set (6 colors)",
            offer: "40% off",
            oldPrice: 19.68,
            price: 11.81,
            image: "https://m.media-amazon.com/images/I/61X5Zm6hIqL._SX466_.jpg",
        },
    ];

    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [category, setCategory] = useState("fragrances");
    const { userId, setUserId } = useContext(UserType);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://dtthuy1204.github.io/product-data/product.json");
                setProducts(response.data);
            } catch (error) {
                console.log("error message", error);
            }
        };
        fetchData();
    }, []);

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    return (
        <>
            <SafeAreaView
                style={{
                    paddingTop: Platform.OS === "android" ? 40 : 0,
                    flex: 1,
                    backgroundColor: "#FFF0F5",
                }}
            >
                <ScrollView ref={scrollRef}>
                    {/* Thanh tìm kiếm */}
                    <View style={styles.searchBar}>
                        <Pressable style={styles.searchInput}>
                            <Feather style={{ paddingLeft: 10 }} name="search" size={22} color="#d63384" />
                            <TextInput placeholder="Search your favorite products..." placeholderTextColor="#d48fb0" />
                        </Pressable>
                        <Feather name="mic" size={24} color="#d63384" />
                    </View>

                    {/* Địa chỉ */}
                    <Pressable
                        onPress={() => navigation.navigate("Address")}
                        style={styles.addressSection}
                    >
                        <Ionicons name="location-outline" size={24} color="#d63384" />
                        <Text style={{ fontSize: 13, fontWeight: "500", color: "#d63384" }}>
                            {selectedAddress
                                ? `Deliver to ${selectedAddress?.name} - ${selectedAddress?.street}`
                                : "Add an Address"}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#d63384" />
                    </Pressable>



                    {/* Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {list.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handleCategorySelect(item.category)}
                                style={[
                                    styles.categoryBox,
                                    selectedCategory === item.category && {
                                        backgroundColor: "#f8bbd0",
                                        borderRadius: 10,
                                    },
                                ]}
                            >
                                <Image style={styles.categoryImage} source={{ uri: item.image }} />
                                <Text style={styles.categoryText}>{item?.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Banner */}
                    <FlatList
                        ref={flatListRef}
                        data={images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onScroll={handleScroll}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.bannerImage} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <View style={styles.dotContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentIndex === index ? "#d63384" : "#f5c0d0" },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Deals */}
                    <Text style={styles.sectionTitle}>✨ Hot Deals for You ✨</Text>
                    <View style={styles.dealContainer}>
                        {deals.map((item, index) => (
                            <Pressable
                                key={index}
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
                            >
                                <Image style={styles.dealImage} source={{ uri: item.image }} />
                            </Pressable>
                        ))}
                    </View>

                    {/* Today's Offers */}
                    <Text style={styles.sectionTitle}>💖 Today's Offers 💖</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {offers.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() =>
                                    navigation.navigate("Info", {
                                        id: item.id,
                                        title: item.title,
                                        price: item.price,
                                        oldPrice: item.oldPrice,
                                        color: item.color || "Pastel Pink",
                                        size: item.size || "Free Size",
                                        carouselImages: item.carouselImages || [item.image],
                                        item: item,
                                    })
                                }
                                style={styles.offerCard}
                            >

                                <Image style={styles.offerImage} source={{ uri: item.image }} />
                                <View style={styles.offerLabel}>
                                    <Text style={styles.offerText}>{item.offer}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Sản phẩm */}
                    <Text style={styles.sectionTitle}>🌸 All Products 🌸</Text>
                    <View style={styles.productContainer}>
                        {products
                            .filter((item) =>
                                selectedCategory
                                    ? item.category?.toLowerCase() === selectedCategory.toLowerCase()
                                    : true
                            )
                            .map((item, index) => (
                                <ProductItem key={index} item={item} />
                            ))}
                    </View>


                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
        borderRadius: 10,
        height: 40,
        flex: 1,
    },
    addressSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        padding: 10,
        backgroundColor: "#fde4ec",
    },
    categoryBox: {
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: "#f48fb1",
        borderWidth: 2,
        resizeMode: "cover",
    },
    categoryText: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "500",
        color: "#d63384",
        marginTop: 5,
    },
    bannerImage: {
        width: width,
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
    },
    dotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    sectionTitle: {
        padding: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#d63384",
    },
    dealContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    dealImage: {
        width: 170,
        height: 170,
        resizeMode: "cover",
        borderRadius: 15,
        margin: 10,
    },
    offerCard: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    offerImage: {
        width: 150,
        height: 150,
        borderRadius: 15,
        resizeMode: "cover",
    },
    offerLabel: {
        backgroundColor: "#d63384",
        paddingVertical: 6,
        width: 130,
        alignItems: "center",
        marginTop: 10,
        borderRadius: 10,
    },
    offerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 13,
    },
    productContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: 50,
    },
});
