const pool = require("../config/db");

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await pool.query(
      "INSERT INTO complaints(user_id,title,description,category) VALUES($1,$2,$3,$4) RETURNING *",
      [req.user.id, title, description, category]
    );

    res.json(complaint.rows[0]);
  } catch {
    res.status(500).json({ message: "Create complaint error" });
  }
};

exports.getMyComplaints = async (req, res) => {
  const data = await pool.query(
    "SELECT * FROM complaints WHERE user_id=$1 ORDER BY id DESC",
    [req.user.id]
  );
  res.json(data.rows);
};

exports.getAllComplaints = async (req, res) => {
  const data = await pool.query(`
    SELECT complaints.*, users.name 
    FROM complaints
    JOIN users ON users.id = complaints.user_id
    ORDER BY complaints.id DESC
  `);
  res.json(data.rows);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const data = await pool.query(
    "UPDATE complaints SET status=$1 WHERE id=$2 RETURNING *",
    [status, req.params.id]
  );

  res.json(data.rows[0]);
};