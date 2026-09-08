// frontend/src/pages/admin/AdminTambahProdukPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils";

export default function AdminTambahProdukPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_produk: "",      
    kategori: "Baju Rajut",    
    harga: "",
    deskripsi: "",
  });

  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const KATEGORI_PRODUK = ["Baju Rajut", "Tas Rajut", "Mainan Rajut", "Aksesoris Rajut"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [hargaRaw, setHargaRaw] = useState("");

    const handleHargaChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9]/g, "");
    setHargaRaw(cleanValue);
    setFormData((prev) => ({
        ...prev,
        harga: cleanValue
    }));
    };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const token = getToken();

    if (!token) {
      setErrorMsg("Sesi Anda telah berakhir / belum login. Silakan login kembali.");
      return;
    }

    if (!formData.nama_produk || !formData.harga) {
      setErrorMsg("Nama produk dan harga wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);

      const dataPayload = new FormData();
      dataPayload.append("nama_produk", formData.nama_produk);
      dataPayload.append("deskripsi", formData.deskripsi);
      dataPayload.append("harga", parseInt(formData.harga));
      dataPayload.append("kategori", formData.kategori);
      
      if (gambar) {
        dataPayload.append("gambar", gambar);
      }

      const response = await fetch("http://localhost:5000/api/admin/produk", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataPayload,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Gagal menambahkan produk");
      }

      navigate("/admin/produk");
    } catch (err) {
      console.error("Gagal tambah produk:", err);
      setErrorMsg(err.message || "Terjadi kesalahan pada server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bold mb-1 fs-4" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Tambah Produk Baru</p>
            <p className="text-muted small mb-0">Isi formulir di bawah untuk menambahkan produk ke katalog toko.</p>
          </div>
          <Link to="/admin/produk" className="btn btn-sm px-3 py-1 fw-semibold rounded-3" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Produk <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_produk" placeholder="Masukkan nama produk..." value={formData.nama_produk} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Harga (Rp) <span className="text-danger">*</span></label>
                <input type="string" className="form-control form-control-sm" name="harga" placeholder="Contoh: 25000000" value={hargaRaw} onChange={handleHargaChange} required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Kategori</label>
                <select className="form-select form-select-sm" name="kategori" value={formData.kategori} onChange={handleChange}>
                  {KATEGORI_PRODUK.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Gambar Produk</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} />
              </div>

              {preview && (
                <div className="col-12">
                  <p className="form-label fw-semibold text-dark small mb-1">Preview Gambar:</p>
                  <div className="border rounded p-1 d-inline-block" style={{ backgroundColor: '#FAF0E6', borderColor: '#E8D3C5' }}>
                    <img src={preview} alt="Preview" className="rounded" style={{ width: "120px", height: "90px", objectFit: "cover" }}/>
                  </div>
                </div>
              )}

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Deskripsi Produk</label>
                <textarea className="form-control form-control-sm" rows="4" name="deskripsi" placeholder="Tuliskan deskripsi lengkap produk..." value={formData.deskripsi} onChange={handleChange}></textarea>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn btn-sm px-4 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan Produk"}</button>
                <Link to="/admin/produk" className="btn btn-light border btn-sm px-3">Batal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}