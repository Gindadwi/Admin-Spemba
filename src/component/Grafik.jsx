import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Grafik = () => {
  // State untuk menyimpan data pendaftar dan bulan yang dipilih
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Januari"); // Default bulan

  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran.json"
        );
        const fetchedData = Object.values(response.data);
        setDataPendaftaran(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Memanggil fetchData saat komponen dimuat
  }, []);

  // Fungsi untuk memparsing tanggal dengan format DD/MM/YYYY
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/"); // Pecah string menjadi [DD, MM, YYYY]
    return new Date(`${year}-${month}-${day}`); // Susun ulang menjadi format YYYY-MM-DD
  };

  // Fungsi untuk memfilter data berdasarkan bulan yang dipilih
  const filterDataByMonth = (month) => {
    const monthMap = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };

    const selectedMonthIndex = monthMap[month];

    // Filter data untuk bulan yang dipilih
    const filteredData = dataPendaftaran.filter((item) => {
      const registrationDate = parseDate(item.tanggalDaftar); // Gunakan parseDate di sini
      return registrationDate.getMonth() === selectedMonthIndex;
    });

    // Mengelompokkan data berdasarkan tanggal (1-30)
    const countsPerDay = Array(30).fill(0); // Inisialisasi array untuk 30 hari

    filteredData.forEach((item) => {
      const registrationDate = parseDate(item.tanggalDaftar); // Gunakan parseDate di sini
      const day = registrationDate.getDate(); // Mendapatkan tanggal (1-30)
      countsPerDay[day - 1] += 1; // Menambahkan jumlah pendaftaran pada tanggal tertentu
    });

    return countsPerDay;
  };

  // Mendapatkan pendaftaran per hari untuk bulan yang dipilih
  const pendaftaranPerHari = filterDataByMonth(selectedMonth);

  // Data untuk grafik
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`), // Label (Hari 1 - Hari 30)
    datasets: [
      {
        label: "Jumlah Pendaftaran",
        data: pendaftaranPerHari, // Data berdasarkan tanggal
        backgroundColor: "#0D3B66",
      },
    ],
  };

  // Opsi untuk grafik
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Grafik Pendaftaran Per Bulan" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-96 text-black font-poppins">
      <div className="grid grid-cols-2 my-5">
        <h3 className="text-lg font-semibold">Grafik Pendaftaran</h3>
        <select
          className="border border-1 border-black rounded-md p-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="Januari">Januari</option>
          <option value="Februari">Februari</option>
          <option value="Maret">Maret</option>
          <option value="April">April</option>
          <option value="Mei">Mei</option>
          <option value="Juni">Juni</option>
          <option value="Juli">Juli</option>
          <option value="Agustus">Agustus</option>
          <option value="September">September</option>
          <option value="Oktober">Oktober</option>
          <option value="November">November</option>
          <option value="Desember">Desember</option>
        </select>
      </div>
      <div className="h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Grafik;
