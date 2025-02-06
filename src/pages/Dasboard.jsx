import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios untuk API requests
import IconTotal from "../assets/Icontotal.png";
import IconDiterima from "../assets/IconDiterima.png";
import IconTolak from "../assets/IconTolak.png";
import GrafikPendaftaran from "../component/Grafik";

const Dashboard = () => {
  const [totalDiterima, setTotalDiterima] = useState(0);
  const [totalDitolak, setTotalDitolak] = useState(0);
  const [totalPendaftar, setTotalPendaftar] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran.json"
        );

        // Convert the object data into an array for easier manipulation
        const registrants = Object.values(response.data || {});

        // Count the statuses
        const diterimaCount = registrants.filter(
          (item) => item.status === "Di Terima"
        ).length;
        const ditolakCount = registrants.filter(
          (item) => item.status === "Di Tolak"
        ).length;

        // Update state
        setTotalDiterima(diterimaCount);
        setTotalDitolak(ditolakCount);
        setTotalPendaftar(registrants.length); // Total registrants
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-y-auto">
      {/* Header */}
      <div className="lg:bg-white w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block">
          Dashboard
        </h1>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-3 justify-center items-center px-4 mt-2 w-full max-w-[1100px]">
        <div className="bg-BiruLow rounded-lg shadow-lg flex gap-4 py-3 px-2 justify-center items-center">
          <div className="flex ">
            <img src={IconTotal} alt="" className="w-[88px] h-[88px]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[24px] font-outfit text-white font-normal">
              Total Pendaftar
            </h1>
            <p className="text-[28px] text-center font-outfit text-white font-bold">
              {totalPendaftar}
            </p>
          </div>
        </div>

        <div className="bg-BiruMedium rounded-lg shadow-lg flex gap-4 py-3 px-2 justify-center items-center">
          <div className="flex ">
            <img src={IconDiterima} alt="" className="w-[88px] h-[88px]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[24px] font-outfit text-white font-normal">
              Total Diterima
            </h1>
            <p className="text-[28px] text-center font-outfit text-white font-bold">
              {totalDiterima}
            </p>
          </div>
        </div>

        <div className="bg-BiruPekat rounded-lg shadow-lg flex gap-4 py-3 px-2 justify-center items-center">
          <div className="flex ">
            <img src={IconTolak} alt="" className="w-[88px] h-[88px]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[24px] font-outfit text-white font-normal">
              Total Ditolak
            </h1>
            <p className="text-[28px] text-center font-outfit text-white font-bold">
              {totalDitolak}
            </p>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="my-5 grid grid-cols-3 px-4">
        <div className="col-span-2">
          <GrafikPendaftaran />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
