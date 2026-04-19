import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createPromisedConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
  });
};

const tableExists = async (connection, tableName) => {
  try {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [tableName]
    );
    return Number(rows[0]?.count || 0) > 0;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
};

const columnExists = async (connection, tableName, columnName) => {
  try {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [tableName, columnName]
    );
    return Number(rows[0]?.count || 0) > 0;
  } catch (err) {
    console.error(
      `Error checking if column ${tableName}.${columnName} exists:`,
      err
    );
    return false;
  }
};

export const ensureRuntimeSchema = async () => {
  let connection;
  try {
    connection = await createPromisedConnection();

    const hasNutValues = await tableExists(connection, 'nut_values');
    if (hasNutValues) {
      const hasWaterGoal = await columnExists(
        connection,
        'nut_values',
        'water_goal'
      );
      if (!hasWaterGoal) {
        await connection.query(
          'ALTER TABLE nut_values ADD COLUMN water_goal FLOAT NOT NULL DEFAULT 2'
        );
      }

      const hasCreatineEnabled = await columnExists(
        connection,
        'nut_values',
        'creatine_enabled'
      );
      if (!hasCreatineEnabled) {
        await connection.query(
          'ALTER TABLE nut_values ADD COLUMN creatine_enabled TINYINT(1) NOT NULL DEFAULT 1'
        );
      }
    }

    const hasWaterTable = await tableExists(connection, 'water_intake');
    if (!hasWaterTable) {
      await connection.query(`
        CREATE TABLE water_intake (
          id INT NOT NULL AUTO_INCREMENT,
          username VARCHAR(100) NOT NULL UNIQUE,
          liters FLOAT NOT NULL DEFAULT 0,
          PRIMARY KEY (id),
          CONSTRAINT fk_water_user FOREIGN KEY (username) REFERENCES user (username)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB
      `);
    }

    const hasCreatineTable = await tableExists(connection, 'creatine_intake');
    if (!hasCreatineTable) {
      await connection.query(`
        CREATE TABLE creatine_intake (
          id INT NOT NULL AUTO_INCREMENT,
          username VARCHAR(100) NOT NULL UNIQUE,
          done TINYINT(1) NOT NULL DEFAULT 0,
          PRIMARY KEY (id),
          CONSTRAINT fk_creatine_user FOREIGN KEY (username) REFERENCES user (username)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB
      `);
    }
  } catch (err) {
    console.error('Schema ensure error:', err.message);
    console.error('Full error:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
