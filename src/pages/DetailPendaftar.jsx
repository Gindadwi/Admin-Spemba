import { useEffect, useRef, useState } from "react";
import Search from "../component/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { Spinner } from "@material-tailwind/react";

const DetailPendaftar = () => {
  const [data, setData] = useState([]); // Data asli dari Firebase
  const [filteredData, setFilteredData] = useState([]); // Data yang ditampilkan berdasarkan pencarian
  const [pendaftaranList, setPendaftaranList] = useState([]); // Daftar pendaftaran yang ditampilkan
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Gunakan location untuk mendeteksi perubahan URL
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch data dari Firebase Realtime Database
  const fetchData = async () => {
    try {
      // Mengambil semua data pendaftaran dari Realtime Database
      const url =
        "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran.json";
      const response = await axios.get(url);
      const data = response.data;

      // Jika data ada, ubah menjadi array dan set ke state
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const sortData = dataArray.sort((a, b) => {
          if (a.status === "Pending" && b.status !== "Pending") return -1;
          if (a.status !== "Pending" && b.status === "Pending") return 1;
          return 0;
        });

        setPendaftaranList(dataArray);
        setData(sortData);
        setFilteredData(dataArray);
      } else {
        setPendaftaranList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data saat komponen dimuat
  }, [location]); // Fetch data setiap kali location berubah

  // Fungsi pencarian
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      toast.error("Isi kolom pencarian");
      setFilteredData(data); // Kembalikan ke semua data jika pencarian kosong
      return;
    }

    const lowercasedTerm = searchTerm.trim().toLowerCase(); // Hilangkan spasi tambahan dan ubah ke huruf kecil
    const filtered = data.filter((detail) => {
      const nama = detail.nama ? detail.nama.toLowerCase() : "";
      const nik = detail.nik ? detail.nik.toLowerCase() : "";
      return nama.includes(lowercasedTerm) || nik.includes(lowercasedTerm);
    });

    console.log("Filtered data:", filtered); // Debug hasil filter
    setFilteredData(filtered); // Set filteredData dengan hasil pencarian
  };

  // Loading spinner saat data sedang diambil
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner color="blue" className="h-12 w-12" />
      </div>
    );
  }

  //membuat fungsi untuk membuka dan menutup dropdown
  const handelDownload = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // membuat fungsi membuka modal
  const handleClickModal = (content) => {
    setModalContent(content);
    const modal = new Modal(document.getElementById("downloadModal"));
    modal.show();
  };

  //membuat fungsi menutup modal
  const closeModal = () => {
    setModalContent(null);
    const modal = new Modal(document.getElementById("downloadModal"));
    modal.hide();
  };

  //Membuat kode download
  const downloadCVS = (data, sortBy) => {
    if (!data || data.length === 0) {
      toast.error("Tidak ada data yang diuntuh");
      return;
    }

    //salin data asli agar tidak memodifikasi state
    const sortedData = [...data];

    if (sortBy === "name") {
      sortedData.sort((a, b) => (a.nama > b.nama ? 1 : -1));
    } else if (sortBy === "total") {
      sortedData.sort((a, b) => {
        const totalA = parseInt(a.IPA) + parseInt(a.MTK) + parseInt(a.BIndo);
        const totalB = parseInt(b.IPA) + parseInt(b.MTK) + parseInt(b.BIndo);
        return totalB - totalA;
      });
    }

    const headers = [
      { label: "Nama", key: "nama" },
      { label: "Tempat Lahir", key: "tempatLahir" },
      { label: "Tanggal Lahir", key: "tanggalLahir" },
      { label: "Alamat", key: "alamat" },
      { label: "NIK", key: "nik" },
      { label: "Jenis Kelamin", key: "jenisKelamin" },
      { label: "Nomor Hp/Wa", key: "noHP" },
      { label: "Nama Orang Tua", key: "namaOrtu" },
      { label: "Asal Sekolah", key: "asalSekolah" },
      { label: "Nilai IPA", key: "IPA" },
      { label: "Nilai Matematika", key: "MTK" },
      { label: "Nilai Bahasa Indonesia", key: "BIndo" },
      { label: "Rata-Rata", key: "total" },
      { label: "Foto 3x4", key: "pasFotoUrl" },
      { label: "Kartu Keluarga (KK)", key: "kkUrl" },
      { label: "SKHUN", key: "skhunUrl" },
      { label: "Akta Kelahiran", key: "aktaKelahiranUrl" },
      { label: "KIP", key: "kipUrl" },
      { label: "Sertifikat", key: "sertifikatUrl" },
    ];

    const csvData = sortedData.map((item) => ({
      nama: item.nama || "Tidak tersedia",
      tempatLahir: item.tempatLahir || "Tidak tersedia",
      tanggalLahir: item.tanggalLahir || "Tidak tersedia",
      alamat: item.alamat || "Tidak tersedia",
      nik: item.nik ? `'${item.nik}` : "Tidak tersedia", // Awali dengan tanda kutip tunggal untuk menghindari format ilmiah
      jenisKelamin: item.jenisKelamin || "Tidak tersedia",
      noHP: item.noHP || "Tidak tersedia",
      namaOrtu: item.namaOrtu || "Tidak tersedia",
      asalSekolah: item.asalSekolah || "Tidak tersedia",
      IPA: item.IPA || "0",
      BIndo: item.BIndo || "0",
      MTK: item.MTK || "0",
      total: item.total || "0",
      pasFotoUrl: item.pasFotoUrl || "Tidak tersedia",
      kkUrl: item.kkUrl || "Tidak tersedia",
      skhunUrl: item.skhunUrl || "Tidak tersedia",
      aktaKelahiranUrl: item.aktaKelahiranUrl || "Tidak tersedia",
      kipUrl: item.kipUrl || "Tidak tersedia",
      sertifikatUrl: item.sertifikatUrl || "Tidak tersedia",
    }));

    //generate csv menggunakan papaparse
    const csv = Papa.unparse({
      fields: headers.map((header) => header.label),
      data: csvData.map((row) => headers.map((header) => row[header.key])),
    });

    //Simpan file csv
    const blob = new Blob([csv], { type: "text/csv;chaset=utf-8" });
    saveAs(blob, `data_pendaftaran_sorted_by_${sortBy}.csv`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${id}.json`;
        await axios.delete(url); // Menghapus data berdasarkan ID
        Swal.fire("Berhasil!", "Data telah dihapus.", "success");
        fetchData(); // Refresh data setelah menghapus
      } catch (error) {
        console.error("Error deleting data:", error);
        Swal.fire("Gagal!", "Data gagal dihapus.", "error");
      }
    }
  };

  return (
    <div className="relative w-full h-screen max-w-[1080px]">
      <div className="bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block">
          Detail Pendaftar
        </h1>
      </div>

      <div className="container w-full mt-5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto flex flex-col lg:max-w-[1920px]">
        <div className="flex gap-3">
          <Search onSearch={handleSearch} />

          {/* membuat fungsi download data */}
          <button
            onClick={handelDownload}
            className="bg-BiruPekat flex justify-center items-center p-3 rounded-lg"
          >
            <h1 className="text-white text-[18px] font-mono font-semibold">
              Download
            </h1>
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-40 py-5 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-gray-400 top-32 right-14 mt-3 lg:w-[250px] lg:right-[190px] "
            >
              <div className="w-full px-5">
                <div className="flex flex-col gap-4 ">
                  <button
                    onClick={() => downloadCVS(pendaftaranList, "name")}
                    className="bg-BiruPekat py-2 rounded-md text-white font-poppins"
                  >
                    Berdasarkan Abjad
                  </button>
                  <button
                    onClick={() => downloadCVS(pendaftaranList, "total")}
                    className="bg-BiruPekat py-2 rounded-md text-white font-poppins"
                  >
                    Berdasarkan Rata-rata
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative max-w-[1020px] 2xl:w-[1440px] my-2 2xl:my-5 overflow-x-auto overflow-y-auto max-h-[450px] ">
          <table className="w-full  text-sm overflow-x-auto relative lg:text-base table-auto rounded-lg">
            <thead className="bg-BiruPekat text-sm text-white font-poppins sticky top-0 z-10">
              <tr>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  No
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  Nama Lengkap
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  Tempat Lahir
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  Tanggal Lahir
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  NIK
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  Status
                </th>
                <th className="px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id || index} // Gunakan id atau fallback ke index jika id tidak ada
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 whitespace-nowrap font-outfit font-normal text-left">
                    {item.nama || "Nama tidak ditemukan"}
                  </td>
                  <td className="px-5 py-2 whitespace-nowrap font-outfit font-normal text-left">
                    {item.tempatLahir || "Tempat lahir kosong"}
                  </td>
                  <td className="px-5 py-2 whitespace-nowrap font-outfit font-normal text-left">
                    {item.tanggalLahir || "Tanggal lahir kosong"}
                  </td>
                  <td className="px-5 py-2 whitespace-nowrap font-outfit font-normal text-left">
                    {item.nik || "NIK tidak ditemukan"}
                  </td>
                  <td className="px-5 py-2 whitespace-nowrap font-outfit font-normal text-left">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "Di Terima"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status || "Status tidak ditemukan"}
                    </span>
                  </td>
                  <td className="flex h-full gap-3 m-0 items-center justify-center mt-3">
                    <button
                      onClick={() => navigate(`/detail-pendaftaran/${item.id}`)}
                      className="bg-green-700 hover:bg-green-950 text-white px-4 py-2 rounded-lg transform transition-transform hover:scale-110"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-orange-500 hover:bg-orange-800 text-white px-4 py-2 rounded-lg transform transition-transform hover:scale-110"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailPendaftar;
