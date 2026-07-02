import express from 'express';
import { body, validationResult } from 'express-validator';
import con from '../db.js';

const router = express.Router();

router.post(
  '/eaten',
  [body('meal').trim().notEmpty().withMessage('Meal name is required')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.username;
    const { meal } = req.body;

    const sql = 'INSERT INTO eaten_meal (username, meal) VALUES (?, ?)';
    con.query(sql, [user, meal], (err, result) => {
      if (err) {
        console.error('Eaten add error');
        return res
          .status(500)
          .json({ error: 'Could not add eaten meal. Please try again later.' });
      }
      return res.json({ success: true, id: result.insertId });
    });
  }
);

router.delete('/eaten', (req, res) => {
  const user = req.username;
  const { id } = req.body;

  const sql = 'DELETE FROM eaten_meal WHERE username = ? AND id = ?';
  con.query(sql, [user, id], (err) => {
    if (err) {
      console.error('Clear eaten error');
      return res.status(500).json({
        error: 'Could not delete eaten meal. Please try again later.',
      });
    }
    return res.json({ success: true });
  });
});

router.delete('/eaten/all', (req, res) => {
  const user = req.username;

  const clearEatenSql = 'DELETE FROM eaten_meal WHERE username = ?';
  const clearWaterSql = 'DELETE FROM water_intake WHERE username = ?';
  const clearCreatineSql = 'DELETE FROM creatine_intake WHERE username = ?';
  const clearOneTimeMealSql =
    'DELETE FROM meal WHERE username = ? AND is_one_time = 1';
  const clearOneTimeFoodSql =
    'DELETE FROM food WHERE username = ? AND is_one_time = 1';

  con.query(clearEatenSql, [user], (eatenErr) => {
    if (eatenErr) {
      console.error('Clear eaten error');
      return res.status(500).json({
        error: 'Could not clear eaten meals. Please try again later.',
      });
    }

    con.query(clearWaterSql, [user], (waterErr) => {
      if (waterErr) {
        console.error('Clear water tracking error');
        return res.status(500).json({
          error: 'Could not clear water tracking. Please try again later.',
        });
      }

      con.query(clearCreatineSql, [user], (creatineErr) => {
        if (creatineErr) {
          console.error('Clear creatine tracking error');
          return res.status(500).json({
            error: 'Could not clear creatine tracking. Please try again later.',
          });
        }

        con.query(clearOneTimeMealSql, [user], (oneTimeMealErr) => {
          if (oneTimeMealErr) {
            console.error('Clear one-time meals error');
            return res.status(500).json({
              error: 'Could not clear one-time meals. Please try again later.',
            });
          }

          con.query(clearOneTimeFoodSql, [user], (oneTimeFoodErr) => {
            if (oneTimeFoodErr) {
              console.error('Clear one-time ingredients error');
              return res.status(500).json({
                error:
                  'Could not clear one-time ingredients. Please try again later.',
              });
            }

            return res.json({ success: true });
          });
        });
      });
    });
  });
});

export default router;
