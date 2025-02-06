import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Tambahimg = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    paragraf: "",
    image: null,
  });
  const navigate = useNavigate();

  // Mengatur perubahan pada input teks dan file
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0]; // Mengambil file pertama dari input
      //periksa ukuran file
      const MAX_FILE_SIZE = 1 * 1024 * 1024; //ukuran file maksimal 1 mb
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Ukuran file maksimal adalah 1 MB.");
        return;
      }

      setFormData({ ...formData, [name]: files[0] });
      setImage(URL.createObjectURL(files[0])); // Menampilkan preview gambar
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Periksa jika gambar ada
      if (!formData.image) {
        toast.error("Gambar belum dipilih.");
        return;
      }

      const storage = getStorage();
      const fileFields = ["image"];
      const fileUrls = {};

      // Proses upload file ke Firebase Storage
      for (const field of fileFields) {
        if (formData[field]) {
          // Buat referensi ke Firebase Storage
          const storageRef = ref(
            storage,
            `PrestasiSMP/${field}-${formData[field].name}`
          );

          // Upload gambar ke Firebase Storage
          await uploadBytes(storageRef, formData[field]);
          const downloadURL = await getDownloadURL(storageRef); // Dapatkan URL gambar yang diupload
          fileUrls[field] = downloadURL;
        }
      }

      // Siapkan data yang akan disimpan di Realtime Database
      const prestasi = {
        image: fileUrls.image || "",
        title: formData.title || "",
        paragraf: formData.paragraf || "",
      };

      // URL untuk Firebase Realtime Database
      const url =
        "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/Prestasi.json";

      // Cek apakah data sudah ada berdasarkan title
      const response = await axios.get(url);
      const existingData = response.data;
      const isDuplicate = Object.values(existingData || {}).some(
        (item) => item.title === prestasi.title
      );

      if (isDuplicate) {
        // Jika sudah ada, beri peringatan
        toast.error("Data dengan title yang sama sudah ada.");
        return;
      }

      // Jika data belum ada, simpan data baru
      await axios.post(url, prestasi);

      toast.success("Pendaftaran berhasil!");
      navigate("/imageSlider"); // Arahkan ke halaman lain
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  // Menghapus gambar yang telah diupload
  const handleRemoveImage = () => {
    setImage(null); // Reset gambar
    setFormData({ ...formData, image: null }); // Clear image field di formData
  };

  return (
    <>
      <div className="lg:bg-white w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block">
          Create Image
        </h1>
      </div>

      <div className="max-w-[1080px] px-4 mt-7">
        <form onSubmit={handleSubmit}>
          <label htmlFor="" className="font-outfit text-[18px] font-medium">
            Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative">
            {image ? (
              <div className="relative w-full h-48">
                <img
                  src={image}
                  alt="uploaded"
                  className="w-full h-full object-contain"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full py-2 px-3 text-xs hover:bg-red-600"
                  onClick={handleRemoveImage}
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                Drag & Drop your files or <br />{" "}
                <span className="mt-2 mr-2">Maksimal size 1mb</span>
                <label
                  htmlFor="file-upload"
                  className="text-orange-500 underline cursor-pointer"
                >
                  Browse
                </label>
              </p>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              name="image"
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 mt-5 gap-3">
            <div className="w-full">
              <label htmlFor="" className="font-outfit text-[18px] font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                onChange={handleInputChange}
                className="w-full rounded-md py-2 px-2 border border-1 border-gray-400 shadow-md"
              />
            </div>
            <div className="w-full">
              <label htmlFor="" className="font-outfit text-[18px] font-medium">
                Keterangan
              </label>
              <input
                type="text"
                name="paragraf"
                onChange={handleInputChange}
                className="w-full rounded-md py-2 px-2 border border-1 border-gray-400 shadow-md"
              />
            </div>
          </div>

          <button className="bg-BiruPekat text-white font-poppins font-medium rounded-md py-2 px-5 mt-4">
            Create
          </button>
        </form>
      </div>
    </>
  );
};

export default Tambahimg;
