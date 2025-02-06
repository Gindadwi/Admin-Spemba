// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const DetailPendaftaran = () => {
//   const { userId } = useParams();
//   const [pendaftaran, setPendaftaran] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${userId}.json`
//         );

//         if (response.data) {
//           const [firstEntry] = Object.values(response.data);
//           setPendaftaran(firstEntry);
//           setFormData(firstEntry);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       await axios.patch(
//         `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${userId}.json`,
//         formData
//       );
//       setPendaftaran(formData);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!pendaftaran) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Data tidak ditemukan</h2>
//           <Link
//             to="/list-pendaftaran"
//             className="text-blue-500 hover:underline"
//           >
//             Kembali ke daftar
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className=" w-full py-8 px-4 overflow-y-auto h-screen">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//         <div className="mb-6 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Detail Pendaftaran Siswa
//           </h1>
//           <Link
//             to="/list-pendaftaran"
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//           >
//             Kembali
//           </Link>
//         </div>

//         <div className="space-y-6">
//           {/* Data Pribadi */}
//           <div className="border rounded-lg shadow-sm bg-gray-50">
//             <div className="border-b px-4 py-2 bg-gray-100">
//               <h2 className="font-bold text-lg text-gray-700">Data Pribadi</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
//               {[
//                 "nama",
//                 "nik",
//                 "alamat",
//                 "tempatLahir",
//                 "tanggalLahir",
//                 "noHP",
//               ].map((field) => (
//                 <div key={field}>
//                   <label className="font-medium capitalize">
//                     {field.replace(/([A-Z])/g, " $1")}
//                   </label>
//                   <input
//                     type="text"
//                     name={field}
//                     value={formData[field] || ""}
//                     onChange={handleInputChange}
//                     className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
//                     disabled={!isEditing}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Data Akademik */}
//           <div className="border rounded-lg shadow-sm bg-gray-50">
//             <div className="border-b px-4 py-2 bg-gray-100">
//               <h2 className="font-bold text-lg text-gray-700">Data Akademik</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
//               {["asalSekolah", "namaOrtu"].map((field) => (
//                 <div key={field}>
//                   <label className="font-medium capitalize">
//                     {field.replace(/([A-Z])/g, " $1")}
//                   </label>
//                   <input
//                     type="text"
//                     name={field}
//                     value={formData[field] || ""}
//                     onChange={handleInputChange}
//                     className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
//                     disabled={!isEditing}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Status Pendaftaran */}
//           <div className="border rounded-lg shadow-sm bg-gray-50">
//             <div className="border-b px-4 py-2 bg-gray-100">
//               <h2 className="font-bold text-lg text-gray-700">
//                 Status Pendaftaran
//               </h2>
//             </div>
//             <div className="px-4 py-4">
//               <select
//                 name="status"
//                 value={formData.status || ""}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
//                 disabled={!isEditing}
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Diterima">Diterima</option>
//                 <option value="Ditolak">Ditolak</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-6 flex justify-end space-x-4">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Simpan
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//               >
//                 Batal
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
//             >
//               Edit Data
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailPendaftaran;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID tidak ditemukan, silakan login.");
      setLoading(false);
      return;
    }

    // Ambil data pengguna berdasarkan userId
    const url = `https://smpmuhsumbang-9fa3a-default-rtdb.firebaseio.com/pendaftaran/${userId}.json`;

    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setUserData(response.data); // Menyimpan data yang diterima ke state
        } else {
          setError("Data tidak ditemukan.");
        }
      })
      .catch((err) => {
        setError("Terjadi kesalahan saat mengambil data.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Data Pendaftaran</h2>
      {userData ? (
        <div>
          <p>Nama: {userData.nama}</p>
          <p>Tempat Lahir: {userData.tempatLahir}</p>
          <p>Tanggal Lahir: {userData.tanggalLahir}</p>
          <p>Alamat: {userData.alamat}</p>
          <p>Jenis Kelamin: {userData.jenisKelamin}</p>
          <p>status: {userData.status}</p>
          {/* Tampilkan data lainnya */}
        </div>
      ) : (
        <p>Data tidak ditemukan.</p>
      )}
    </div>
  );
};

export default ProfilePage;
