import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import login from "./routes/auth-routes.js";
import { forgotPassword } from "./routes/forgot-password.js";
import {
  getAllSuratMasuk,
  getAllSuratMasukByNomorSurat,
  addSuratMasuk,
  deleteSuratMasukByNomorSurat,
  getAllSuratKeluar,
  getAllSuratKeluarByNomorSurat,
  addSuratKeluar,
  editSuratKeluarByNomorSurat,
  deleteSuratKeluarByNomorSurat,
  searchSurat,
} from "./routes/surat-routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// function auth(req, res, next) {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split(" ")[1];
//     jwt.verify(token, "rahasia", async (err, _decoded) => {
//       if (!err) {
//         next();
//       } else {
//         res.status(401).send("Token salah.");
//       }
//     });
//   } else {
//     res.status(401).send("Token belum ada.");
//   }
// }

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.path === "/api/login" || req.path.startsWith("/assets")) {
    next();
  } else {
    let authorized = false;
    if (req.cookies.token) {
      try {
        req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        authorized = true;
      } catch (err) {
        res.setHeader("Cache-Control", "no-store");
        res.clearCookie("token");
      }
    }
    if (authorized) {
      if (req.path.startsWith("/login")) {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      if (req.path.startsWith("/login")) {
        next();
      } else {
        if (req.path.startsWith("/api")) {
          res.status(401);
          res.send("Anda harus login terlebih dahulu.");
        } else {
          res.redirect("/login");
        }
      }
    }
  }
});


const upload = multer({ dest: "public/photos" });

// END POINT API = LOGIN
app.post("/api/login", login);

// END POINT API = FORGOT PASSWORD
app.put("/api/forgotpass", forgotPassword);

app.use(auth);

// END POINT API = MENAMPILKAN DATA SURAT MASUK
app.get("/api/surat/keluar", getAllSuratKeluar);

// END POINT API = MENAMBAH SURAT KELUAR DAN FOTO
app.post("/api/surat/keluar", upload.single("photoEx"), addSuratKeluar);

// END POINT API = MELIHAT DETAIL DATA SURAT KELUAR SESUAI NOMOR SURAT
app.get("/api/surat/keluar:nomor_suratEx", getAllSuratKeluarByNomorSurat);

// END POINT API = MENGUPDATE SURAT
app.put("/api/surat/keluar:nomor_suratEx", editSuratKeluarByNomorSurat);

// END POINT API = MENGHAPUS SURAT KELUAR
app.delete("/api/surat/keluar:nomor_suratEx", deleteSuratKeluarByNomorSurat);

// END POINT API = MENAMPILKAN DATA
app.get("/api/surat", getAllSuratMasuk);

// END POINT API = MELIHAT DETAIL DATA SURAT MASUK SESUAI NOMOR SURAT
app.get("/api/surat/:nomor_surat", getAllSuratMasukByNomorSurat);

// END POINT API = MENAMBAH SURAT MASUK DAN FOTO
app.post("/api/surat", upload.single("photo"), addSuratMasuk);

// END POINT API = MENGHAPUS SURAT MASUK
app.delete("/api/surat/:nomor_surat", deleteSuratMasukByNomorSurat);

// END POINT API = UNTUK SERACH SURAT
app.post("/api/search", searchSurat);

app.listen(3000, () => console.log("server sedang berjalan"));
