import mysql from 'mysql2/promise';

const createPool = () => {
  try {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
  }
};

export const db = createPool();