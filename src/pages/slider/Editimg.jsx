import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const Editimg = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    paragraf: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mengatur perubahan pada input teks dan file
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0]; // Mengambil file pertama dari input
      const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Ukuran file maksimal adalah 1 MB.");
        return;
      }

      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file)); // Menampilkan preview gambar
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Menghapus gambar yang telah diupload
  const handleRemoveImage = () => {
    setImagePreview(null); // Reset gambar preview
    setFormData({ ...formData, image: null }); // Clear image field di formData
  };

  // Fetch data dari database berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/Prestasi/${id}.json`
        );

        // Jika data ditemukan
        if (response.data) {
          // Set data ke state
          setFormData({
            // Set default value jika data kosong
            title: response.data.title || "",
            paragraf: response.data.paragraf || "",
            image: response.data.image || "",
          });
          setImagePreview(response.data.image || null); // Set preview gambar jika ada
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

  // Menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storage = getStorage();
      const fileFields = ["image"];
      const fileUrls = {};

      // Proses upload file jika ada perubahan
      for (const field of fileFields) {
        if (formData[field] instanceof File) {
          const storageRef = ref(
            storage,
            `PrestasiSMP/${field}-${formData[field].name}`
          );

          await uploadBytes(storageRef, formData[field]);
          const downloadURL = await getDownloadURL(storageRef);
          fileUrls[field] = downloadURL;
        } else {
          fileUrls[field] = formData[field]; // Gunakan URL gambar lama jika tidak diubah
        }
      }

      // Data yang akan diupdate
      const prestasi = {
        image: fileUrls.image || "",
        title: formData.title || "",
        paragraf: formData.paragraf || "",
      };

      // Update data di Firebase
      const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/Prestasi/${id}.json`;
      await axios.put(url, prestasi);

      toast.success("Data berhasil diperbarui!");
      navigate("/imageSlider");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.error("Gagal memperbarui data.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="lg:bg-white w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block">
          Edit Image
        </h1>
      </div>

      <div className="max-w-[1080px] px-4 mt-7">
        <form onSubmit={handleSubmit}>
          <label htmlFor="" className="font-outfit text-[18px] font-medium">
            Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative">
            {imagePreview ? (
              <div className="relative w-full h-48">
                <img
                  src={imagePreview}
                  alt="uploaded"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full py-2 px-3 text-xs hover:bg-red-600"
                  onClick={handleRemoveImage}
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                Drag & Drop your files or{" "}
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
                value={formData.title}
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
                value={formData.paragraf}
                onChange={handleInputChange}
                className="w-full rounded-md py-2 px-2 border border-1 border-gray-400 shadow-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-BiruPekat text-white font-poppins font-medium rounded-md py-2 px-5 mt-4"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default Editimg;
