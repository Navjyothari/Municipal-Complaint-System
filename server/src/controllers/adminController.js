const { pool } = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const totalComplaints = await pool.query('SELECT COUNT(*) FROM complaints');
    const statusCounts = await pool.query('SELECT status, COUNT(*) FROM complaints GROUP BY status');
    const categoryCounts = await pool.query('SELECT category, COUNT(*) FROM complaints GROUP BY category');

    const activityCount = await pool.query('SELECT COUNT(*) FROM activity_logs');

    res.json({
      success: true,
      data: {
        total_complaints: parseInt(totalComplaints.rows[0].count),
        by_status: statusCounts.rows,
        by_category: categoryCounts.rows,
        total_activity_logs: parseInt(activityCount.rows[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    let query = 'SELECT * FROM complaints WHERE 1=1';
    let values = [];

    if (req.query.status) {
      values.push(req.query.status);
      query += ` AND status = $${values.length}`;
    }
    if (req.query.category) {
      values.push(req.query.category);
      query += ` AND category = $${values.length}`;
    }
    if (req.query.urgency) {
      values.push(req.query.urgency);
      query += ` AND urgency = $${values.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY created_at DESC');
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const result = await pool.query(
      'INSERT INTO departments (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }
    next(error);
  }
};
