import mysql from "mysql"


export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mohit@1234",
  database: "social"
});