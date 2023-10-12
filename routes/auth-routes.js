import conn from "../database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function tampilData(_req, res) {
  const rows = await conn.query(`SELECT * FROM masuk`);
  res.send(rows[0]);
  console.log(rows[0]);
}
export async function registrasi(req, res){
  const rows = await conn.query(`SELECT * FROM masuk WHERE passwordd = '${req.body.passowrdd}'`);
  if(rows === 1){
    res.send("data tidak boleh sama");
  }else{
    const salt = await bcrypt.gentSalt();
    const hash = await bcrypt.hash(req.body.passwordd, salt);
    await conn.query (`INSERT INTO masuk VALUES('${req.body.username}', '${hash}')`);
    res.send("berhasil registrasi");
  }
  
}

export default async function login(req, res) {
  const rows = await conn.query(
    `SELECT * FROM masuk WHERE username = '${req.body.username}'`
  );
  console.log(rows);

  let cek;

  if (rows.length > 0) {
    if (
      req.body.username === rows[0].username &&
      (await bcrypt.compare(req.body.passwordd, rows[0].passwordd))
    ) {
      cek = true;
    }

    if (cek === true) {
      const token = jwt.sign(rows[0], process.env.SECRET_KEY);
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
