require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    console.log("server is running");
})
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.listen(5000, () => {
  console.log("Server running on port http://localhost:5000");
});