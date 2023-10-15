import conn from "../database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function tampilData(_req, res) {
  const data = await conn.query(`SELECT * FROM masuk`);
  res.send(data[0]);
  console.log(data[0]);
}
export async function registrasi(req, res) {
  const data = await conn.query(
    `SELECT * FROM masuk WHERE passwordd = '${req.body.passowrdd}'`
  );
  if (data === 1) {
    res.send("data tidak boleh sama");
  } else {
    const salt = await bcrypt.gentSalt();
    const hash = await bcrypt.hash(req.body.passwordd, salt);
    await conn.query(
      `INSERT INTO masuk VALUES('${req.body.username}', '${hash}')`
    );
    res.send("berhasil registrasi");
  }
}

export default async function login(req, res) {
  const data = await conn.query(
    `SELECT * FROM masuk WHERE username = '${req.body.username}'`
  );
  console.log(data);

  let cek;

  if (data.length > 0) {
    const cek = await bcrypt.compare(req.body.passowrdd, data[0].passowrdd);
    if (cek === true) {
      const token = jwt.sign(data[0], process.env.SECRET_KEY);
      res.cookie("token", token);
      res.send("berhasil login");
      console.log(token);
    } else {
      res.send("user belum ada");
    }
  } else {
    res.send("username atau password salah");
  }
}
