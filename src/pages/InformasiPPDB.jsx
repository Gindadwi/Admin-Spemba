import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import gaya bawaan Quill

const InformasiPPDB = () => {
  const { id } = useParams();
  const [tanggal_buka, setStartDate] = useState(null);
  const [tanggal_tutup, setFinishDate] = useState(null);
  const [detail, setDetails] = useState("");
  const [status, setStatus] = useState("");

  // Fungsi untuk mengambil data informasi pendaftaran dari Firebase
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/InformasiPPDB/${id}.json`
      );

      if (response.data) {
        const { tanggal_buka, tanggal_tutup, details, status } = response.data;

        // Konversi tanggal menjadi objek Date
        setStartDate(tanggal_buka ? new Date(tanggal_buka) : null);
        setFinishDate(tanggal_tutup ? new Date(tanggal_tutup) : null);
        setDetails(details || "");
        setStatus(status || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Terjadi kesalahan saat mengambil data");
    }
  };

  // Fungsi untuk mengupdate data di Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedStartDate = tanggal_buka
      ? format(tanggal_buka, "yyyy-MM-dd")
      : null;
    const formattedFinishDate = tanggal_tutup
      ? format(tanggal_tutup, "yyyy-MM-dd")
      : null;

    const data = {
      tanggal_buka: formattedStartDate,
      tanggal_tutup: formattedFinishDate,
      details: detail,
      status,
    };

    try {
      const response = await axios.put(
        `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/InformasiPPDB/${id}.json`,
        data
      );
      console.log("Response status:", response.status); // Log status code
      if (response.status === 200) {
        toast.success("Data berhasil diperbarui");
      } else {
        toast.error("Gagal memperbarui data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Terjadi kesalahan saat memperbarui data");
    }
  };

  // Hook untuk memuat data saat komponen pertama kali dipasang
  useEffect(() => {
    fetchData(); // Panggil fungsi fetchData untuk mengambil data
  }, [id]); // Pastikan useEffect dijalankan ulang jika id berubah

  // Daftar status yang dapat dipilih
  const statusOption = [
    { title: "Pendaftaran Di Buka" },
    { title: "Belum Di Buka" },
  ];

  return (
    <div className="relative w-full max-w-[1080px]">
      <div className="bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium">
          Informasi PPDB
        </h1>
      </div>

      <div className="mt-6 w-full flex items-center justify-center px-10">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div>
              <DatePicker
                placeholderText="Tanggal Mulai Pendaftaran"
                dateFormat="dd/MM/yyyy"
                selected={tanggal_buka || null} // Nilai default
                onChange={(date) => setStartDate(date)}
                className="w-[310px] h-14 rounded-md px-3 font-outfit border border-1 border-black box-border"
              />
            </div>

            <div>
              <DatePicker
                placeholderText="Tanggal Selesai Pendaftaran"
                dateFormat="dd/MM/yyyy"
                selected={tanggal_tutup}
                onChange={(date) => setFinishDate(date)}
                className="w-[310px] h-14 rounded-md px-3 font-outfit border border-1 border-black box-border"
              />
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-[310px] h-14 rounded-md px-3 font-outfit border border-1 border-black box-border"
              >
                <option value="">Pilih Status</option>
                {statusOption.map((status, index) => (
                  <option key={index} value={status.title}>
                    {status.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 mb-6">
            <ReactQuill
              className="w-full h-80 rounded-md bg-white custom-editor"
              theme="snow"
              value={detail}
              onChange={setDetails}
              placeholder="Detail informasi terkait pendaftaran"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-BiruPekat text-white px-6 py-2 rounded-md font-outfit mb-4"
            >
              Simpan Informasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InformasiPPDB;
