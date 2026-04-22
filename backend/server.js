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


const pool = require("./config/db");

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ connected: true, time: result.rows[0] });
  } catch (err) {
    console.error("DB ERROR 👉", err);   // ⭐ important
    res.json({ connected: false, error: err.message });
  }
});
console.log("DB URL:", process.env.DATABASE_URL);

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.listen(5000, () => {
  console.log("Server running on port http://localhost:5000");
});