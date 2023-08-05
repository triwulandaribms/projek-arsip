import conn from "../database.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const rows = await conn.query(
    `SELECT * FROM masuk WHERE username = '${req.body.username}'`
  );
  console.log(rows);
  if (rows.length > 0) {
    if (req.body.passwordd === rows[0].passwordd) {
      const token = jwt.sign(rows[0], "rahasia");
      res.send(token);
    } else {
      res.status(401).send("kata sandi salah");
    }
  } else {
    res.status(401).send("Nama pengguna tidak ditemukan.");
  }
}

export default login;
