//packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
 
//Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
 
dotenv.config({ path: "./backend/.env" });
const port = process.env.PORT || 5000;
 
connectDB();
 
const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
const __dirname = path.resolve();
 
app.use(express.static(path.resolve(__dirname, "./backend/client/dist")));
 
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
 
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
 
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
 
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./backend/client/dist", "index.html"));
});
 
app.listen(port, () => console.log(`Server running on port: ${port}`));