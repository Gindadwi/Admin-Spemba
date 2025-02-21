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
import toast from "react-hot-toast";

export const Faqs = () => {
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  //kode untuk memanggil data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/FAQ.json"
      );
      const data = response.data;

      // if (response.data) {
      //   setFormData({
      //     question: formData.question || "",
      //     answer: formData.answer || "",
      //   });
      // }

      // Convert object data ke array untuk mempermudah manipulasi
      if (data) {
        // Convert object data ke array untuk mempermudah manipulasi
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Update state
        setData(dataArray);
        // Update state
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek jika form tidak diisi
    try {
      const FAQS = {
        question: formData.question || "",
        answer: formData.answer || "",
      };

      const url =
        "https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/FAQ.json";

      await axios.post(url, FAQS);
      setFormData({ question: "", answer: "" }); // Kosongkan form data di sini
      toast.success("FAQ Berhasil ditambahkan");
      fetchData(); // Refresh data setelah form dikosongkan
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  //Mermbuat handle update data
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!modalContent) return;

    try {
      // Kirim data ke Database
      const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/FAQ/${modalContent.id}.json`;
      await axios.put(url, modalContent);
      toast.success("Data berhasil diperbarui!");
      fetchData(); // Refresh data
      closeModal(); // Tutup modal
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data:", error);
      toast.error("Gagal memperbarui data.");
    }
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

    // Jika pengguna mengonfirmasi
    if (result.isConfirmed) {
      try {
        const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/FAQ/${id}.json`;
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
    <div className="relative h-screen overflow-y-auto overflow-x-hidden">
      <div className="lg:bg-white w-full lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg">
        <h1 className="font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="w-full ml-5 px-12">
        <form onSubmit={handleSubmit}>
          <div className="w-full items-end mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="question" className="font-outfit text-[18px]">
                  Pertanyaan
                </label>
                <input
                  type="text"
                  name="question"
                  className="w-full py-3 px-2 rounded-md mt-2 shadow-md border border-1 border-gray-400"
                  placeholder="Masukkan pertanyaan"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="answer" className="font-outfit text-[18px]">
                  Jawaban
                </label>
                <input
                  type="text"
                  name="answer"
                  className="w-full py-3 px-2 rounded-md mt-2 shadow-md border border-1 border-gray-400"
                  placeholder="Masukkan jawaban"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="w-full flex justify-end items-end">
              <button
                type="submit"
                className="bg-BiruPekat py-2 px-9 text-white font-poppins rounded-md mt-5"
              >
                <div className="flex items-center justify-center gap-2">
                  <IoIosAddCircle />
                  <span>Tambah FAQ</span>
                </div>
              </button>
            </div>
          </div>
        </form>

        <div className="container bg-white w-full max-w-[1080px]  overflow-x-auto mt-5 mb-10 rounded-lg shadow-md max-h-[450px]">
          <table className="w-full text-sm lg:text-base border-collapse ">
            <thead className="bg-BiruPekat text-white font-outfit">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">
                  Pertanyaan
                </th>
                <th className="px-5 py-3 text-left font-semibold">Jawaban</th>

                <th className="px-5 py-3 text-center font-semibold">Action</th>
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
                  <td className="px-5 py-4 text-left font-poppins text-[13px]">
                    {item.question || "Nama tidak ditemukan"}
                  </td>
                  <td className="px-5 py-4 text-left font-poppins text-[13px]">
                    {item.answer || "Deskripsi tidak tersedia"}
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
            <DialogHeader>Update FAQ</DialogHeader>
            <DialogBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="">Edit Pertanyaan</label>
                  <input
                    type="text"
                    id="editPertanyaan"
                    className="font-poppins  text-black mt-3 w-full border border-gray-500 rounded-md px-2 py-3 shadow-md"
                    value={modalContent?.question || ""}
                    onChange={(e) =>
                      setModalContent({
                        ...modalContent,
                        question: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="">Edit Jawaban</label>
                  <input
                    type="text"
                    id="editPertanyaan"
                    className="font-poppins  text-black mt-3 w-full border border-gray-500 rounded-md px-2 py-3 shadow-md"
                    value={modalContent?.answer || ""}
                    onChange={(e) =>
                      setModalContent({
                        ...modalContent,
                        answer: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <div className="flex gap-2">
                <Button color="green" onClick={handleUpdate}>
                  Update
                </Button>
                <Button color="red" onClick={closeModal}>
                  Batal
                </Button>{" "}
              </div>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
