import React, { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ImageSlider = () => {
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/Prestasi.json"
      );
      const data = response.data;

      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setData(dataArray);
        setFilterData(dataArray);
      } else {
        setFilterData([]);
      }
    } catch (error) {
      console.error("data tidak ditemukan");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (item) => {
    setModalContent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  //membuat handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Image akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/Prestasi/${id}.json`;
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
    <>
      <div className="relative w-full max-w-[1080px]">
        {/* Header */}
        <div className="bg-white w-screen items-center justify-start flex p-4 h-[63px] sticky top-0 z-10">
          <h1 className="font-outfit text-[18px] lg:text-2xl font-medium">
            Setting Image
          </h1>
        </div>

        <div className="w-full ml-5 px-12">
          <div className="w-full flex flex-col justify-end items-end mt-5">
            <button
              onClick={() => navigate("/TambahImage")}
              className="bg-BiruPekat py-2 px-9 text-white font-poppins rounded-md"
            >
              <div className="flex items-center justify-center gap-2">
                <IoIosAddCircle />
                <span>New Image</span>
              </div>
            </button>
          </div>

          <div className="container bg-white w-full max-w-[1080px]  overflow-x-auto mt-5 rounded-lg shadow-md max-h-[450px]">
            <table className="w-full text-sm lg:text-base border-collapse ">
              <thead className="bg-BiruPekat text-white font-outfit">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Image</th>
                  <th className="px-5 py-3 text-left font-semibold">Title</th>
                  <th className="px-5 py-3 text-left font-semibold">
                    Keterangan
                  </th>
                  <th className="px-5 py-3 text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-5 py-4 text-center">
                      <img
                        src={item.image}
                        alt="Preview"
                        className="w-22 h-12 object-cover rounded-lg border"
                      />
                    </td>
                    <td className="px-5 py-4 text-left font-poppins text-[13px]">
                      {item.title || "Nama tidak ditemukan"}
                    </td>
                    <td className="px-5 py-4 text-left font-poppins text-[13px]">
                      {item.paragraf || "Deskripsi tidak tersedia"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center  font-semibold  text-[15px] items-center gap-4">
                        <button
                          onClick={() => openModal(item)}
                          className="flex items-center text-gray-800 font-outfit hover:text-gray-800"
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/EditImage/${item.id}`)}
                          className="flex items-center text-orange-700 font-outfit hover:text-orange-700"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center text-red-700 font-outfit hover:text-red-800"
                        >
                          <RiDeleteBin5Fill className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Dialog open={isModalOpen} handler={closeModal}>
              <DialogHeader>View Item</DialogHeader>
              <DialogBody>
                <div className="flex items-center justify-center">
                  <img src={modalContent?.image} alt="" className="w-[400px]" />
                </div>
                <p className="font-poppins font-semibold text-black mt-3">
                  Judul: {modalContent?.title}
                </p>
                <p className="font-poppins font-normal text-gray-800 mt-1">
                  Keterangan: {modalContent?.paragraf}
                </p>
              </DialogBody>
              <DialogFooter>
                <Button variant="gradient" color="red" onClick={closeModal}>
                  Close
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
