import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoDashboard from "../assets/LogoDashboard.png";
import Dashboard from "../assets/Dashboard.png";
import DetailPendaftaran from "../assets/DetailPendaftaran.png";
import ImageSlider from "../assets/ImageSlider.png";
import InformasiPendaftaran from "../assets/InformasiPendaftaran.png";
import Service from "../assets/Services.png";
import Faqs from "../assets/Ask Question.png";
import Logout from "../assets/Logout.png";
import { ChevronDown, ChevronUp } from "lucide-react"; // Ikon untuk toggle submenu

const Sidebar = () => {
  const navigate = useNavigate();

  // State untuk mengontrol apakah submenu Setting ditampilkan
  const [showSettingSubmenu, setShowSettingSubmenu] = useState(false);

  // Daftar menu utama
  const Menu = [
    { title: "Dashboard", path: "/dashboard", img: Dashboard },
    {
      title: "Detail Pendaftar",
      path: "/detailPendaftar",
      img: DetailPendaftaran,
    },
    {
      title: "Setting",
      img: Service, // Tidak perlu ikon khusus untuk menu induk
      isExpandable: true, // Indikator bahwa menu ini memiliki submenu
      subMenu: [
        {
          title: "Faqs",
          path: "/Faqs",
          img: Faqs,
        },
        { title: "Image", path: "/imageSlider", img: ImageSlider },
        {
          title: "Informasi PPDB",
          path: "/informasiPPDB/-OGz39eDI3MzSDxuEIOM",
          img: InformasiPendaftaran,
        },
      ],
    },
    { title: "Log Out", path: "/", img: Logout },
  ];

  // Fungsi untuk toggle submenu
  const toggleSettingSubmenu = () => {
    setShowSettingSubmenu((prev) => !prev);
  };

  return (
    <div>
      <div className="bg-BiruPekat h-screen pt-1 w-[250px] ">
        <div className="flex flex-col gap-1 p-3 justify-center items-center">
          <img src={LogoDashboard} className="w-[100px]" alt="Logo" />
          <p className="text-white font-semibold font-outfit text-center text-[18px] pb-1">
            SMP Muhammadiyah Sumbang
          </p>
        </div>
        <hr className="h-1 pt-4" />
        <div>
          <ul>
            {Menu.map((menu, index) => (
              <li key={index}>
                {menu.isExpandable ? (
                  // Menu dengan submenu
                  <div>
                    <div
                      onClick={toggleSettingSubmenu}
                      className="text-white font-outfit font-normal py-4 cursor-pointer hover:bg-BiruLow flex justify-between items-center px-6"
                    >
                      <span className="flex gap-4 xl:text-[16px]  font-medium items-center">
                        {menu.img && (
                          <img
                            src={menu.img}
                            alt={menu.title}
                            className="w-[26px] h-[23px] "
                          />
                        )}
                        {menu.title}
                      </span>
                      {showSettingSubmenu ? (
                        <ChevronUp className="text-white" />
                      ) : (
                        <ChevronDown className="text-white" />
                      )}
                    </div>
                    {/* Submenu */}
                    {showSettingSubmenu && (
                      <ul className="pl-8">
                        {menu.subMenu.map((sub, subIndex) => (
                          <li
                            key={subIndex}
                            onClick={() => navigate(sub.path)}
                            className="text-white font-outfit font-normal py-3 cursor-pointer hover:bg-BiruLow"
                          >
                            <span className="flex gap-4 text-[14px] 2xl:text-[16px] px-3 font-medium items-center">
                              {sub.img && (
                                <img
                                  src={sub.img}
                                  alt={sub.title}
                                  className="w-[20px] h-[20px] 2xl:w-[25px] 2xl:h-[25px]"
                                />
                              )}
                              {sub.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Menu biasa
                  <li
                    onClick={() => navigate(menu.path)}
                    className="text-white font-outfit font-normal py-4 cursor-pointer hover:bg-BiruLow"
                  >
                    <span className="flex gap-4 text-[16px] font-medium items-center px-6">
                      {menu.img && (
                        <img
                          src={menu.img}
                          alt={menu.title}
                          className="w-[23px] h-[23px]"
                        />
                      )}
                      {menu.title}
                    </span>
                  </li>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
