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
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Januari");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran.json"
        );
        const fetchedData = Object.values(response.data);

        console.log("Data dari Firebase:", fetchedData); // Debugging
        setDataPendaftaran(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      console.warn("Tanggal tidak valid:", dateString);
      return new Date(NaN); // Mengembalikan invalid date
    }

    const parts = dateString.split("/");
    if (parts.length !== 3) {
      console.warn("Format tanggal tidak valid:", dateString);
      return new Date(NaN);
    }

    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`);
  };

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

    const filteredData = dataPendaftaran.filter((item) => {
      if (!item.tanggalDaftar) {
        console.warn("Data tanpa tanggal ditemukan:", item);
        return false;
      }

      const registrationDate = parseDate(item.tanggalDaftar);
      return (
        !isNaN(registrationDate) &&
        registrationDate.getMonth() === selectedMonthIndex
      );
    });

    const countsPerDay = Array(30).fill(0);

    filteredData.forEach((item) => {
      if (!item.tanggalDaftar) return;

      const registrationDate = parseDate(item.tanggalDaftar);
      if (!isNaN(registrationDate)) {
        const day = registrationDate.getDate();
        countsPerDay[day - 1] += 1;
      }
    });

    return countsPerDay;
  };

  const pendaftaranPerHari = filterDataByMonth(selectedMonth);

  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`),
    datasets: [
      {
        label: "Jumlah Pendaftaran",
        data: pendaftaranPerHari,
        backgroundColor: "#0D3B66",
      },
    ],
  };

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
