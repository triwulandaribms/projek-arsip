import conn from "../database.js";

// BAGIAN SURAT MASUK
export async function getAllSuratMasuk(_req, res) {
  const data = await conn.query(
    `SELECT * FROM SuratIn ORDER BY nomor_surat ASC`
  );
  res.send(data);
}

export async function getAllSuratMasukByNomorSurat(req, res) {
  const data = await conn.query(
    `SELECT * FROM SuratIn WHERE nomor_surat = '${req.params.nomor_surat}'`
  );
  res.send(data[0]);
}

export async function addSuratMasuk(req, res) {
  await conn.query(
    `INSERT INTO SuratIn VALUES ('${req.body.nomor_surat}','${req.body.judul_surat}',
      '${req.body.asal_surat}','${req.body.tanggal_masuk}',
      '${req.body.tanggal_terima}','${req.body.jenis_surat}',
      '${req.body.sifat_surat}','${req.file.filename}')`
  );

  res.send("Surat Telah Masuk.");
}

export async function deleteSuratMasukByNomorSurat(req, res) {
  await conn.query(
    `DELETE FROM SuratIn WHERE nomor_surat = '${req.params.nomor_surat}'`
  );
  res.send("Surat Telah Dihapus.");
}

// BAGIAN SURAT KELUAR
export async function addSuratKeluar(req, res) {
  await conn.query(
    `INSERT INTO SuratEx VALUES ('${req.body.nomor_suratEx}',
  '${req.body.judul_suratEx}','${req.body.tujuanEx}','${req.body.tanggal_keluarEx}',
  '${req.body.jenis_suratEx}','${req.body.sifat_suratEx}','${req.file.filename}')`
  );

  res.send("Surat Keluar Telah Terkirim");
}

export async function getAllSuratKeluar(_req, res) {
  const data = await conn.query(
    `SELECT * FROM SuratEx ORDER BY nomor_suratEx ASC`
  );
  res.send(data);
}

export async function getAllSuratKeluarByNomorSurat(req, res) {
  const data = await conn.query(
    `SELECT * FROM SuratEx WHERE nomor_suratEx = '${req.params.nomor_suratEx}'`
  );
  res.send(data[0]);
}

export async function editSuratKeluarByNomorSurat(req, res) {
  await conn.query(
    `UPDATE SuratEx SET nomor_suratEx = '${req.body.nomor_suratEx}',judul_suratEx = '${req.body.judul_suratEx}',tujuanEx = '${req.body.tujuanEx}',tanggal_keluarEx = '${req.body.tanggal_keluarEx}',
    jenis_suratEx = '${req.body.jenis_suratEx}',sifat_suratEx = '${req.body.sifat_suratEx}' WHERE nomor_suratEx = '${req.params.nomor_suratEx}'`
  );

  res.send("Surat Keluar Telah Diedit");
}

export async function deleteSuratKeluarByNomorSurat(req, res) {
  await conn.query(
    `DELETE FROM SuratEx WHERE nomor_suratEx = '${req.params.nomor_suratEx}'`
  );
  res.send("Surat Telah Dihapus");
}

export async function searchSurat(req, res) {
  const data =
    await conn.query(`SELECT * FROM SuratIn WHERE jenis_surat = '${req.body.jenis_surat}'
  `);

  if (
    req.body.jenis_surat.includes("sosial") ||
    req.body.jenis_surat.includes("penting") ||
    req.body.jenis_surat.includes("biasa") ||
    req.body.jenis_surat.includes("niaga")
  ) {
    res.json(data.rows);
  }
}
