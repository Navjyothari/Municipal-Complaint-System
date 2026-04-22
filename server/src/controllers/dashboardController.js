const { pool } = require('../config/db');

exports.getSummary = async (req, res, next) => {
  try {
    let statsQuery = 'SELECT status, COUNT(*) FROM complaints WHERE user_id = $1 GROUP BY status';
    const result = await pool.query(statsQuery, [req.user.id]);
    
    // Uptime normally from process, or just mock it for summary as per requirements
    const uptime = process.uptime();

    res.json({
      success: true,
      data: {
        uptime_seconds: uptime,
        user_complaints_by_status: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserComplaints = async (req, res, next) => {
  try {
    let query = 'SELECT * FROM complaints WHERE user_id = $1';
    let values = [req.user.id];

    if (req.query.filter && req.query.filter !== 'all') {
      values.push(req.query.filter);
      query += ` AND status = $2`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
};
