import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import axios from "axios";
import { FaPlus, FaTrash, FaImage, FaEdit } from "react-icons/fa";

// Tipe Data
type Varian = {
  id_warna: number;
  stokPerUkuran: Record<string, number>;
};

type Foto = {
  url_foto: string | null;
  file: File | null;
  id_warna: string | null;
};

export default function EditProduk() {
  const { id_produk } = useParams<{ id_produk: string }>();
  const navigate = useNavigate();

  const [merk, setMerk] = useState<{ value: string; label: string }[]>([]);
  const [tipe, setTipe] = useState<{ value: string; label: string }[]>([]);
  const [ukuran, setUkuran] = useState<{ value: string; label: string }[]>([]);
  const [warna, setWarna] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState({
    id_merk: "",
    id_tipe: "",
    nama_kaos: "",
    harga_jual: "",
    harga_pokok: "",
    deskripsi: "",
    spesifikasi: "",
  });

  const [formVariants, setFormVariants] = useState<Varian[]>([
    { id_warna: 0, stokPerUkuran: {} },
  ]);

  const [formPhotos, setFormPhotos] = useState<Foto[]>([
    { url_foto: null, file: null, id_warna: null },
  ]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch data produk & master
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        // Fetch produk (info dasar saja)
        const response = await axios.get(
          `http://localhost:8080/api/v1/produk/${id_produk}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch master data
        const masterResponse = await axios.get(
          "http://localhost:8080/api/v1/master-data/produk",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const produk = response.data;
        const master = masterResponse.data;

        // Set form data
        setFormData({
          id_merk: String(produk.id_merk),
          id_tipe: String(produk.id_tipe),
          nama_kaos: produk.nama_kaos,
          harga_jual: String(produk.harga_jual),
          harga_pokok: String(produk.harga_pokok),
          deskripsi: produk.deskripsi || "",
          spesifikasi: produk.spesifikasi || "",
        });

        // Set master data
        setMerk(
          master.merk.map((m: any) => ({
            value: m.id_merk.toString(),
            label: m.nama_merk,
          }))
        );
        setTipe(
          master.tipe.map((t: any) => ({
            value: t.id_tipe.toString(),
            label: t.nama_tipe,
          }))
        );
        setUkuran(
          master.ukuran.map((u: any) => ({
            value: u.id_ukuran.toString(),
            label: u.nama_ukuran,
          }))
        );
        setWarna(
          master.warna.map((w: any) => ({
            value: w.id_warna.toString(),
            label: w.nama_warna,
          }))
        );

        // === FETCH VARIAN DARI ENDPOINT BARU ===
        const varianResponse = await axios.get(
          `http://localhost:8080/api/v1/varian/produk/${id_produk}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const varianList = varianResponse.data || [];

        // Kelompokkan varian berdasarkan id_warna
        const groupedByWarna: Record<number, Record<string, number>> = {};
        varianList.forEach((v: any) => {
          if (!groupedByWarna[v.id_warna]) {
            groupedByWarna[v.id_warna] = {};
          }
          groupedByWarna[v.id_warna][v.id_ukuran.toString()] = v.stok_kaos;
        });

        // Buat array varian untuk form
        const initialVariants = Object.entries(groupedByWarna).map(
          ([idWarna, stokPerUkuran]) => ({
            id_warna: parseInt(idWarna),
            stokPerUkuran,
          })
        );

        if (initialVariants.length === 0) {
          setFormVariants([{ id_warna: 0, stokPerUkuran: {} }]);
        } else {
          setFormVariants(initialVariants);
        }

        // === FETCH FOTO PRODUK ===
        const fotoResponse = await axios.get(
          `http://localhost:8080/api/v1/foto-produk/produk/${id_produk}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fotoList = fotoResponse.data.data || fotoResponse.data || [];
        const initialPhotos = fotoList.map((f: any) => ({
          url_foto: f.url_foto,
          file: null,
          id_warna: f.id_warna.toString(),
        }));

        if (initialPhotos.length === 0) {
          setFormPhotos([{ url_foto: null, file: null, id_warna: null }]);
        } else {
          setFormPhotos(initialPhotos);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Gagal memuat data produk. Silakan coba lagi.");
      }
    };

    if (id_produk) {
      fetchData();
    }
  }, [id_produk]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value.toString() }));
  };

  const handleAddVariant = () => {
    setFormVariants([...formVariants, { id_warna: 0, stokPerUkuran: {} }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (formVariants.length <= 1) {
      alert("Minimal 1 varian harus ada.");
      return;
    }
    setFormVariants(formVariants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormVariants(
      formVariants.map((v, i) => {
        if (i === index) {
          if (field === "stokPerUkuran") {
            return { ...v, stokPerUkuran: value };
          }
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  const handleAddPhoto = () => {
    setFormPhotos([
      ...formPhotos,
      { url_foto: null, file: null, id_warna: null },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    if (formPhotos.length <= 1) {
      alert("Minimal 1 foto harus ada.");
      return;
    }
    setFormPhotos(formPhotos.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    const newPhotos = [...formPhotos];
    newPhotos[index] = {
      ...newPhotos[index],
      url_foto: url,
      file: file,
    };
    setFormPhotos(newPhotos);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi utama
    if (
      !formData.id_merk ||
      !formData.id_tipe ||
      !formData.nama_kaos ||
      !formData.harga_jual ||
      !formData.harga_pokok ||
      !formData.deskripsi ||
      !formData.spesifikasi
    ) {
      alert("Harap lengkapi semua field wajib di bagian Informasi Produk.");
      return;
    }

    // Validasi Varian
    const hasValidVariant = formVariants.some((v) => {
      if (v.id_warna <= 0) return false;
      return Object.values(v.stokPerUkuran).some((stok) => stok > 0);
    });

    if (!hasValidVariant) {
      alert(
        "Harap isi minimal satu varian: pilih Warna dan isi Stok untuk minimal satu Ukuran."
      );
      return;
    }

    // Validasi Foto
    const hasValidPhoto = formPhotos.some(
      (photo) =>
        (photo.url_foto !== null && photo.id_warna !== null) ||
        (photo.file !== null && photo.id_warna !== null)
    );
    if (!hasValidPhoto) {
      alert("Harap upload minimal satu foto dan pilih warnanya.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const token = getToken();

    try {
      // Step 1: Update Produk
      const productPayload = {
        id_merk: parseInt(formData.id_merk),
        id_tipe: parseInt(formData.id_tipe),
        nama_kaos: formData.nama_kaos,
        harga_jual: parseInt(formData.harga_jual),
        harga_pokok: parseInt(formData.harga_pokok),
        deskripsi: formData.deskripsi,
        spesifikasi: formData.spesifikasi,
      };

      await axios.put(
        `http://localhost:8080/api/v1/produk/${id_produk}`,
        productPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Ambil semua varian & foto produk lama dari backend
      const varianLamaResponse = await axios.get(
        `http://localhost:8080/api/v1/varian/produk/${id_produk}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const varianLamaList = varianLamaResponse.data || [];

      const fotoLamaResponse = await axios.get(
        `http://localhost:8080/api/v1/foto-produk/produk/${id_produk}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fotoLamaList = fotoLamaResponse.data || [];

      // Step 3: Proses Varian
      // 3.1: Hapus varian yang tidak ada di form
      for (const vLama of varianLamaList) {
        const adaDiForm = formVariants.some((vBaru) => {
          if (vBaru.id_warna === vLama.id_warna) {
            // Cek apakah ukuran ini ada di stokPerUkuran
            return (
              vBaru.stokPerUkuran[vLama.id_ukuran.toString()] !== undefined
            );
          }
          return false;
        });
        if (!adaDiForm) {
          await axios.delete(
            `http://localhost:8080/api/v1/varian/${vLama.id_varian}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      // 3.2: Simpan atau update varian yang ada di form
      for (const variant of formVariants) {
        if (variant.id_warna <= 0) continue;

        for (const [idUkuranStr, stok] of Object.entries(
          variant.stokPerUkuran
        )) {
          if (stok > 0) {
            // Cari varian lama dengan id_warna dan id_ukuran yang sama
            const varianLama = varianLamaList.find(
              (v: any) =>
                v.id_warna === variant.id_warna &&
                v.id_ukuran === parseInt(idUkuranStr)
            );

            if (varianLama) {
              // Update varian lama
              await axios.put(
                `http://localhost:8080/api/v1/varian/${varianLama.id_varian}`,
                {
                  id_produk: parseInt(id_produk || "0"),
                  id_ukuran: parseInt(idUkuranStr),
                  id_warna: variant.id_warna,
                  stok_kaos: stok,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } else {
              // Buat varian baru
              await axios.post(
                "http://localhost:8080/api/v1/varian",
                {
                  id_produk: parseInt(id_produk || "0"),
                  id_ukuran: parseInt(idUkuranStr),
                  id_warna: variant.id_warna,
                  stok_kaos: stok,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
          }
        }
      }

      // Step 4: Proses Foto
      // 4.1: Hapus foto yang tidak ada di form
      for (const fLama of fotoLamaList) {
        const masihAda = formPhotos.some(
          (fBaru) => fBaru.url_foto === fLama.url_foto
        );
        if (!masihAda) {
          await axios.delete(
            `http://localhost:8080/api/v1/foto-produk/${fLama.id_foto_produk}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 4.2: Simpan atau update foto yang ada di form
      for (const photo of formPhotos) {
        if (photo.file) {
          const formData = new FormData();
          const idWarna = photo.id_warna ? parseInt(photo.id_warna) : 0;
          formData.append("id_produk", String(id_produk));
          formData.append("id_warna", idWarna.toString());
          formData.append("url_foto", photo.file);

          await axios.post(
            "http://localhost:8080/api/v1/foto-produk",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
      }

      setMessage("Produk berhasil diperbarui!");
      setTimeout(() => navigate("/produk"), 1500);
    } catch (err: any) {
      console.error("Error updating product:", err);
      const msg = err.response?.data?.message || "Gagal memperbarui produk.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Edit Produk</h1>
        </div>
      </section>

      {message && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* === Bagian 1: Informasi Produk === */}
            <div className="bg-gray-700/50 p-5 rounded-lg border border-gray-600 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FaEdit className="mr-2" /> Informasi Produk
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Produk */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    name="nama_kaos"
                    value={formData.nama_kaos}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Kaos Distro Basic Hitam"
                    required
                  />
                </div>

                {/* Merk & Tipe */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Merk *
                  </label>
                  <Select
                    options={merk}
                    defaultValue={formData.id_merk}
                    placeholder="Pilih Merk"
                    onChange={handleSelectChange("id_merk")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Tipe *
                  </label>
                  <Select
                    options={tipe}
                    defaultValue={formData.id_tipe}
                    placeholder="Pilih Tipe"
                    onChange={handleSelectChange("id_tipe")}
                    className="w-full"
                  />
                </div>

                {/* Harga Jual & Harga Pokok */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Harga Jual *
                  </label>
                  <input
                    type="number"
                    name="harga_jual"
                    value={formData.harga_jual}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Harga Pokok *
                  </label>
                  <input
                    type="number"
                    name="harga_pokok"
                    value={formData.harga_pokok}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">
                    Deskripsi Produk *
                  </label>
                  <TextArea
                    rows={6}
                    value={formData.deskripsi}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, deskripsi: value }))
                    }
                    placeholder="Deskripsi produk"
                    className="w-full"
                  />
                </div>

                {/* Spesifikasi */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">
                    Spesifikasi Produk *
                  </label>
                  <TextArea
                    rows={6}
                    value={formData.spesifikasi}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, spesifikasi: value }))
                    }
                    placeholder="Spesifikasi produk"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* === Bagian 2: Varian === */}
            <div className="bg-gray-700/50 p-5 rounded-lg border border-gray-600 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FaEdit className="mr-2" /> Varian (Ukuran & Warna)
                </h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaPlus className="mr-1" /> Tambah
                </button>
              </div>

              <div className="space-y-4">
                {formVariants.map((v, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-end items-center mb-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-400 hover:text-red-200 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Dropdown Warna */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Warna
                      </label>
                      <Select
                        options={warna}
                        defaultValue={v.id_warna.toString()}
                        placeholder="Pilih Warna"
                        onChange={(value) =>
                          handleVariantChange(index, "id_warna", Number(value))
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Grid Ukuran + Input Stok */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {ukuran.map((uk) => (
                        <div
                          key={uk.value}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-white font-medium min-w-12">
                            {uk.label}
                          </span>
                          <input
                            type="number"
                            value={
                              v.stokPerUkuran?.[uk.value] !== undefined
                                ? v.stokPerUkuran[uk.value]
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value
                                ? parseInt(e.target.value, 10)
                                : 0;
                              handleVariantChange(index, "stokPerUkuran", {
                                ...v.stokPerUkuran,
                                [uk.value]: val,
                              });
                            }}
                            placeholder={`Stok ${uk.label}`}
                            className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-3 italic">
                * Hanya ukuran dengan stok yang diisi lebih dari 0 akan disimpan
                ke database.
              </p>
            </div>

            {/* === Bagian 3: Foto Produk === */}
            <div className="bg-gray-700/50 p-5 rounded-lg border border-gray-600 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FaImage className="mr-2" /> Foto Produk
                </h3>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaPlus className="mr-1" /> Tambah
                </button>
              </div>

              <div className="space-y-4">
                {formPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-end items-center mb-3">
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="text-red-400 hover:text-red-200 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Dropdown Warna */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Warna *
                      </label>
                      <Select
                        options={warna}
                        defaultValue={photo.id_warna || ""}
                        placeholder="Pilih Warna"
                        onChange={(value) => {
                          const newPhotos = [...formPhotos];
                          newPhotos[index].id_warna = value
                            ? value.toString()
                            : null;
                          setFormPhotos(newPhotos);
                        }}
                        className="w-full"
                      />
                    </div>

                    {/* Upload File */}
                    <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-800/50 hover:bg-gray-800 transition cursor-pointer">
                      {photo.url_foto ? (
                        <img
                          src={photo.url_foto}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="text-gray-400 mb-2">
                          <FaImage className="text-2xl" />
                        </div>
                      )}
                      <label
                        htmlFor={`photo-upload-${index}`}
                        className="text-white font-medium cursor-pointer"
                      >
                        {photo.url_foto
                          ? "Klik Untuk Ganti Foto"
                          : "Klik untuk Upload Foto"}
                      </label>
                      <p className="text-gray-400 text-xs mt-1">
                        PNG, JPG maks. 5MB
                      </p>
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, index)}
                        className="hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Simpan & Kembali */}
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 ${
                  saving ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium rounded-md transition`}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <Link
                to="/produk"
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
