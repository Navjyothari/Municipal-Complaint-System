const { pool } = require('../config/db');

exports.getComplaints = async (req, res, next) => {
  try {
    let query;
    let values = [];
    if (req.user.role === 'admin') {
      query = 'SELECT * FROM complaints ORDER BY created_at DESC';
    } else {
      query = 'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC';
      values.push(req.user.id);
    }
    const result = await pool.query(query, values);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, urgency, location_lat, location_lng } = req.body;
    
    // Auto-generate ref_number MC-XXXX
    const seqResult = await pool.query("SELECT nextval('complaint_ref_seq')");
    const ref_number = `MC-${seqResult.rows[0].nextval}`;

    const newComplaint = await pool.query(
      `INSERT INTO complaints (ref_number, user_id, title, description, category, urgency, location_lat, location_lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [ref_number, req.user.id, title, description, category, urgency, location_lat, location_lng]
    );

    res.status(201).json({ success: true, data: newComplaint.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = 'SELECT * FROM complaints WHERE id = $1';
    let values = [id];

    if (req.user.role !== 'admin') {
      query += ' AND user_id = $2';
      values.push(req.user.id);
    }

    const complaintResult = await pool.query(query, values);
    if (complaintResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found or unauthorized access' });
    }
    
    // Fetch logs
    const logsResult = await pool.query('SELECT * FROM activity_logs WHERE complaint_id = $1 ORDER BY created_at ASC', [id]);
    
    res.json({ success: true, data: { ...complaintResult.rows[0], activity_logs: logsResult.rows } });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.assignDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department_id } = req.body;

    const result = await pool.query(
      'UPDATE complaints SET department_id = $1, assigned_by = $2, status = $3 WHERE id = $4 RETURNING *',
      [department_id, req.user.id, 'in_progress', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.addActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body;

    const result = await pool.query(
      'INSERT INTO activity_logs (complaint_id, logged_by, action, note) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, req.user.id, action, note]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.uploadEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const urls = files.map(file => `/uploads/${file.filename}`);

    const result = await pool.query(
      'UPDATE complaints SET evidence_urls = array_cat(COALESCE(evidence_urls, ARRAY[]::TEXT[]), $1) WHERE id = $2 RETURNING *',
      [urls, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
