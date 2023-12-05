import conn from "../database.js";

export default async function forgotPassword(req, res) {
  const rows = await client.query(
    `SELECT * FROM adminn WHERE username = '${req.body.username}'`
  );
  if (rows.length > 0) {
    await conn.query(`UPDATE adminn SET passwordd = '${req.body.passwordd}' WHERE username = '${req.body.username}'
        `);
    res.send("berhasil ubah password");
  } else {
    res.send("username harus sama");
  }
}
