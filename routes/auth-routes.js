import conn from "../database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function tampilData(_req, res) {
  const data = await conn.query(`SELECT * FROM adminn`);
  res.send(data);
}
export async function registrasi(req, res) {
  const data = await conn.query(
    `SELECT * FROM adminn WHERE passwordd = '${req.body.passwordd}'`
  );
  if (data.length === 1) {
    res.send("password tidak boleh sama");
  } else {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.passwordd, salt);
    await conn.query(
      `INSERT INTO adminn VALUES('${req.body.username}', '${hash}')`
    );
    res.send("berhasil registrasi");
  }
}

export default async function login(req, res) {
  const rows = await conn.query(
    `SELECT * FROM adminn WHERE username = '${req.body.username}'`
  );
  console.log(rows);

  if (rows.length > 0) {
    if (
      req.body.username === rows[0].username &&
      (await bcrypt.compare(req.body.passwordd, rows[0].passwordd))
    ) {
      const token = jwt.sign(rows[0], process.env.SECRET_KEY);
      res.cookie("token", token);
      res.send("berhasil login");
    } else {
      res.send("password salah");
    }
  } else {
    res.send("username tidak ditemukan");
  }
}
