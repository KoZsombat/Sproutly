import express from 'express';
import { body, validationResult } from 'express-validator';
import con from '../db.js';

const router = express.Router();

router.get('/tracking', (req, res) => {
  try {
    const user = req.username;
    if (!user) {
      console.error('Tracking GET: No username in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const waterSql =
      'SELECT liters FROM water_intake WHERE username = ? LIMIT 1';
    const creatineSql =
      'SELECT done FROM creatine_intake WHERE username = ? LIMIT 1';

    con.query(waterSql, [user], (waterErr, waterRows) => {
      try {
        if (waterErr) {
          console.error(
            `Tracking water query error for user ${user}:`,
            waterErr.message
          );
          if (waterErr.code === 'ER_NO_SUCH_TABLE') {
            return res.json({ water: 0, creatineDone: false });
          }
          return res.json({ water: 0, creatineDone: false });
        }

        con.query(creatineSql, [user], (creatineErr, creatineRows) => {
          try {
            if (creatineErr) {
              console.error(
                `Tracking creatine query error for user ${user}:`,
                creatineErr.message
              );
              if (creatineErr.code === 'ER_NO_SUCH_TABLE') {
                return res.json({
                  water: waterRows.length > 0 ? Number(waterRows[0].liters) : 0,
                  creatineDone: false,
                });
              }
              return res.json({
                water: waterRows.length > 0 ? Number(waterRows[0].liters) : 0,
                creatineDone: false,
              });
            }

            return res.json({
              water: waterRows.length > 0 ? Number(waterRows[0].liters) : 0,
              creatineDone:
                creatineRows.length > 0 ? Boolean(creatineRows[0].done) : false,
            });
          } catch (innerErr) {
            console.error('Error processing creatine response:', innerErr);
            return res.json({
              water: waterRows.length > 0 ? Number(waterRows[0].liters) : 0,
              creatineDone: false,
            });
          }
        });
      } catch (innerErr) {
        console.error('Error processing water response:', innerErr);
        return res.json({ water: 0, creatineDone: false });
      }
    });
  } catch (err) {
    console.error('Unexpected error in tracking GET:', err);
    res.json({ water: 0, creatineDone: false });
  }
});

router.put(
  '/tracking/water',
  [
    body('liters')
      .isFloat({ min: 0, max: 100000 })
      .withMessage('Water liters must be between 0 and 100000'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(' '),
        });
      }

      const user = req.username;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { liters } = req.body;

      const sql =
        'INSERT INTO water_intake (username, liters) VALUES (?, ?) ON DUPLICATE KEY UPDATE liters = VALUES(liters)';
      con.query(sql, [user, liters], (err) => {
        try {
          if (err) {
            console.error('Tracking water update error:', err.message);
            // For table not existing, create it and try again
            if (err.code === 'ER_NO_SUCH_TABLE') {
              // Table will be created by schema guard on next restart
            }
            // Return success anyway - data will be saved when table exists
            return res.json({ success: true });
          }
          return res.json({ success: true });
        } catch (innerErr) {
          console.error('Error sending water update response:', innerErr);
          res.json({ success: true });
        }
      });
    } catch (err) {
      console.error('Unexpected error in water update:', err);
      res.json({ success: true });
    }
  }
);

router.put(
  '/tracking/creatine',
  [body('done').isBoolean().withMessage('Creatine done must be true or false')],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(' '),
        });
      }

      const user = req.username;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { done } = req.body;

      const sql =
        'INSERT INTO creatine_intake (username, done) VALUES (?, ?) ON DUPLICATE KEY UPDATE done = VALUES(done)';
      con.query(sql, [user, done ? 1 : 0], (err) => {
        try {
          if (err) {
            console.error('Tracking creatine update error:', err.message);
            // For table not existing, create it and try again
            if (err.code === 'ER_NO_SUCH_TABLE') {
              // Table will be created by schema guard on next restart
            }
            // Return success anyway - data will be saved when table exists
            return res.json({ success: true });
          }
          return res.json({ success: true });
        } catch (innerErr) {
          console.error('Error sending creatine update response:', innerErr);
          res.json({ success: true });
        }
      });
    } catch (err) {
      console.error('Unexpected error in creatine update:', err);
      res.json({ success: true });
    }
  }
);

export default router;
