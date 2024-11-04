import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'YOUR_SCHOOL_IP', 
  user: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  database: 'YOUR_DATABASE_NAME',
});
