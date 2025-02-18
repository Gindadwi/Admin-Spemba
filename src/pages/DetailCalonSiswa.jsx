import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { storage } from "../../firebase"; // Import your Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const DetailCalonSiswa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Untuk animasi
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    namaOrtu: "",
    alamat: "",
    noHP: "",
    nik: "",
    asalSekolah: "",
    nilaiIPA: "",
    nilaiIndo: "",
    nilaiMtk: "",
    status: "",
    total: "",
    pasFotoUrl: "",
    aktaKelahiranUrl: "",
    kkUrl: "",
    kipUrl: "",
    skhunUrl: "",
    sertifikatUrl: "",
  });

  const [files, setFiles] = useState({
    pasFoto: null,
    aktaKelahiran: null,
    kk: null,
    kip: null,
    skhun: null,
    sertifikat: null,
  });

  const [statusOptions] = useState([
    { title: "Di Terima" },
    { title: "Di Tolak" },
    { title: "Pending" },
  ]);

  const formFields = [
    { label: "Nama Lengkap", name: "nama", type: "text" },
    { label: "Tempat Lahir", name: "tempatLahir", type: "text" },
    { label: "Tanggal Lahir", name: "tanggalLahir", type: "date" },
    { label: "Nama Orang Tua", name: "namaOrtu", type: "text" },
    { label: "Alamat", name: "alamat", type: "text" },
    { label: "Nomor HP", name: "noHP", type: "text" },
    { label: "NIK", name: "nik", type: "text" },
    { label: "Asal Sekolah", name: "asalSekolah", type: "text" },
    { label: "Nilai IPA", name: "nilaiIPA", type: "number" },
    { label: "Nilai Bahasa Indonesia", name: "nilaiIndo", type: "number" },
    { label: "Nilai Matematika", name: "nilaiMtk", type: "number" },
    { label: "Total Rata-Rata", name: "total", type: "number" },
  ];

  const documentFields = [
    {
      label: "Pas Foto 3X4",
      name: "pasFotoUrl",
      field: "pasFoto",
    },
    {
      label: "Akta Kelahiran",
      name: "aktaKelahiranUrl",
      field: "aktaKelahiran",
    },
    { label: "Kartu Keluarga", name: "kkUrl", field: "kk" },
    { label: "Kartu Indonesia Pintar", name: "kipUrl", field: "kip" },
    { label: "SKHUN", name: "skhunUrl", field: "skhun" },
    { label: "Sertifikat", name: "sertifikatUrl", field: "sertifikat" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${id}.json`
        );

        if (response.data) {
          // Mengisi state formData dengan data yang diterima dari API,
          // dan mengganti tanggalLahir dengan format baru
          setFormData({});
        }

        if (response.data) {
          // Mengonversi format tanggal lahir dari dd/MM/yyyy menjadi yyyy-MM-dd
          const formattedDate = response.data.tanggalLahir
            ? response.data.tanggalLahir.split("/").reverse().join("-") // Memisahkan string tanggal, membalik urutan, lalu menyatukan kembali
            : "";
          // Mengisi state formData dengan data yang diterima dari API,
          // dan mengganti tanggalLahir dengan format baru
          setFormData({
            nama: response.data.nama || "",
            tempatLahir: response.data.tempatLahir || "",
            tanggalLahir: formattedDate || "",
            namaOrtu: response.data.namaOrtu || "",
            alamat: response.data.alamat || "",
            noHP: response.data.noHP || "",
            nik: response.data.nik || "",
            asalSekolah: response.data.asalSekolah || "",
            nilaiIPA: response.data.IPA || "",
            nilaiIndo: response.data.BIndo || "",
            nilaiMtk: response.data.MTK || "",
            status: response.data.status || "",
            total: response.data.total || "",
            pasFotoUrl: response.data.pasFotoUrl || "",
            aktaKelahiranUrl: response.data.aktaKelahiranUrl || "",
            kkUrl: response.data.kkUrl || "",
            kipUrl: response.data.kipUrl || "",
            skhunUrl: response.data.skhunUrl || "",
            sertifikatUrl: response.data.sertifikatUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];

    if (file) {
      setFiles((prevFiles) => ({ ...prevFiles, [field]: file }));
    }
  };

  const uploadFile = async (file, fileName) => {
    const fileRef = ref(storage, `files/${fileName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", null, reject, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      });
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedData = { ...formData };
      for (const [field, file] of Object.entries(files)) {
        if (file) {
          const url = await uploadFile(file, `${id}_${field}`);
          updatedData[`${field}Url`] = url;
        }
      }

      await axios.patch(
        `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${id}.json`,
        updatedData
      );

      setFormData(updatedData); // Update state agar langsung terlihat di UI
      toast.success("Data berhasil diperbarui!");
      navigate("/detailPendaftar");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Gagal memperbarui data.");
    }
  };

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalVisible(true); // Menampilkan modal dengan animasi
  };

  const closeModal = () => {
    setIsModalVisible(false); // Menyembunyikan modal dengan animasi
    setTimeout(() => setModalImage(null), 300); // Hapus gambar setelah animasi selesai
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen overflow-y-auto w-full max-w-[1080px]">
      <div className="bg-white w-screen items-center flex p-4 h-[63px]">
        <h1 className="font-outfit text-2xl font-medium">Detail Calon Siswa</h1>
      </div>

      <div className="flex-grow overflow-y-auto mb-10">
        <div className="container bg-white shadow-md rounded-lg w-full mx-4 max-w-[1080px] p-6 mt-5">
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            {formFields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-[200px_1fr] items-center gap-4"
              >
                <label className="font-medium text-right">{field.label}:</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full h-10 px-4 border border-gray-500 rounded-md"
                />
              </div>
            ))}

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="font-medium text-right">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 px-3 border rounded-md"
              >
                <option value="">Pilih Status</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option.title}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="font-semibold font-outfit text-xl text-center my-6">
              Dokumen Pendukung:
            </h2>

            <div className="grid grid-cols-3 gap-4  px-10">
              {documentFields.map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-2 border border-1 border-gray-400 shadow-md p-3 rounded-md"
                >
                  <label className="font-medium font-poppins">
                    {field.label}:
                  </label>
                  {formData[field.name] ? (
                    <img
                      src={formData[field.name]}
                      alt={field.label}
                      className="w-60 h-48 object-cover border rounded-md cursor-pointer"
                      onClick={() => openModal(formData[field.name])}
                    />
                  ) : (
                    <p className="text-gray-500">Gambar tidak tersedia</p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, field.field)}
                    className="mt-2 text-sm text-gray-700 rounded-md border border-2 border-gray-300"
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex justify-end mt-10">
              <button
                type="submit"
                className="bg-BiruPekat w-48 h-12 text-white font-poppins rounded-lg hover:scale-105"
              >
                Update Data
              </button>
            </div>
          </form>
        </div>
      </div>

      {modalImage && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
            isModalVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal} // Gunakan fungsi closeModal untuk transisi animasi
        >
          <img
            src={modalImage}
            alt="Gambar besar"
            className={`max-w-full max-h-full border rounded-lg transform transition-transform duration-300 ${
              isModalVisible ? "scale-100" : "scale-90"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default DetailCalonSiswa;
