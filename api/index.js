const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3001;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://dthuyy:dthuyy@cluster0.5jp0vvi.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});

const User = require("./models/user");
const Order = require("./models/order");

//function to send Verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
    //create a nodemailer transport
    const transporter = nodemailer.createTransport({
        //configure the mail server
        service: "gmail",
        auth: {
            user: "dinhthuy2004vk@gmail.com",
            pass: "oxbd xvvi ipfb mkgg",
        },
    });
    //compose the email message
    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Click the link below to verify your email: http://${process.env.HOST_IP || '192.168.1.204'}:${port}/verify/${verificationToken}`,
    };

    //send the email
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("Error sending verification email", error);
    }
};
//endpoint to register in the app
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // kiểm tra trống
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

        //check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //create a new User
        const newUser = new User({
            name,
            email,
            password,
        });


        //generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save the user to the db
        await newUser.save();

        //send the verification email to the user
        await sendVerificationEmail(newUser.email, newUser.verificationToken);
        res.status(200).json({ message: "Registration successful. Please check your email for verification." });
        console.log("New user created:", newUser.email, "token:", newUser.verificationToken);
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

//endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        //find the user with the given verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email Verification failed" });
    }
});
// const generateSecretKey = () => {
//     const secretKey = crypto.randomBytes(32).toString("hex");
//     return secretKey;
// }
const secretKey = "my_secret_key_123";

//endpoint to login in the user
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // check verification
        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }

        // check password (currently plaintext)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "7d" });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});


// Add a new address for user
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ message: "Missing userId or address data" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(address);
    await user.save();

    res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all addresses of a user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//all the orders

app.post("/orders", async (req, res) => {
  try {
    console.log("Received new order request");
    console.log("Body:", req.body);

    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !cartItems || !totalPrice || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ép kiểu userId sang ObjectId
    let user;
    try {
      user = await User.findById(new mongoose.Types.ObjectId(userId));
    } catch (e) {
      console.error("Invalid ObjectId format:", userId);
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Kiểm tra user tồn tại
    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Tạo danh sách sản phẩm từ giỏ hàng
    const products = cartItems.map((item) => ({
      name: item?.title || item?.name || "Unknown Product",
      quantity: item.quantity || 1,
      price: item.price || 0,
      image: item?.image || "",
    }));

    if (!products.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      user: user._id,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();
    console.log("Order created successfully:", newOrder._id);

    res.status(200).json({
      message: "Order created successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId",async(req,res) => {
  try{
    const userId = req.params.userId;

    const orders = await Order.find({user:userId}).populate("user");

    if(!orders || orders.length === 0){
      return res.status(404).json({message:"No orders found for this user"})
    }

    res.status(200).json({ orders });
  } catch(error){
    res.status(500).json({ message: "Error"});
  }
});