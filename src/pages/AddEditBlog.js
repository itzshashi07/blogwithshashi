// import React, { useState, useEffect } from "react";
// import ReactTagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";
// import { db, storage } from "../firebase";
// import { useNavigate, useParams } from "react-router-dom";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import {
//   addDoc,
//   collection,
//   getDoc,
//   serverTimestamp,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// const initialState = {
//   title: "",
//   tags: [],
//   trending: "no",
//   category: "",
//   description: "",
//   comments: [],
//   likes: [],
// };

// const categoryOption = [
//   "Fashion",
//   "Technology",
//   "Food",
//   "Politics",
//   "Sports",
//   "Business",
// ];

// const AddEditBlog = ({ user, setActive }) => {
//   const [form, setForm] = useState(initialState);
//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState(null);

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { title, tags, category, trending, description } = form;

//   useEffect(() => {
//     if (file) {
//       const storageRef = ref(storage, `images/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setProgress(progress);
//         },
//         (error) => {
//           console.error("Error uploading file:", error);
//           toast.error("Error uploading file");
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
//             toast.info("Image uploaded to Firebase successfully");
//             setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
//           });
//         }
//       );
//     }
//   }, [file]);

//   useEffect(() => {
//     if (id) {
//       getBlogDetail();
//     }
//   }, [id]);

//   const getBlogDetail = async () => {
//     try {
//       const docRef = doc(db, "blogs", id);
//       const snapshot = await getDoc(docRef);
//       if (snapshot.exists()) {
//         setForm({ ...snapshot.data() });
//       }
//     } catch (error) {
//       console.error("Error fetching blog details:", error);
//     }
//     setActive(null);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleTags = (tags) => {
//     setForm({ ...form, tags });
//   };

//   const handleTrending = (e) => {
//     setForm({ ...form, trending: e.target.value });
//   };

//   const onCategoryChange = (e) => {
//     setForm({ ...form, category: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (category && tags && title && description && trending) {
//       try {
//         const blogData = {
//           ...form,
//           timestamp: serverTimestamp(),
//           author: user.displayName,
//           userId: user.uid,
//         };

//         if (!id) {
//           await addDoc(collection(db, "blogs"), blogData);
//           toast.success("Blog created successfully");
//         } else {
//           await updateDoc(doc(db, "blogs", id), blogData);
//           toast.success("Blog updated successfully");
//         }

//         navigate("/");
//       } catch (error) {
//         console.error("Error submitting blog:", error);
//         toast.error("Failed to submit blog. Please try again.");
//       }
//     } else {
//       toast.error("All fields are mandatory to fill");
//     }
//   };

//   return (
//     <div className="container-fluid mb-4">
//       <div className="container">
//         <div className="col-12">
//           <div className="text-center heading py-2">
//             {id ? "Update Blog" : "Create Blog"}
//           </div>
//         </div>
//         <div className="row h-100 justify-content-center align-items-center">
//           <div className="col-10 col-md-8 col-lg-6">
//             <form className="row blog-form" onSubmit={handleSubmit}>
//               <div className="col-12 py-3">
//                 <input
//                   type="text"
//                   className="form-control input-text-box"
//                   placeholder="Title"
//                   name="title"
//                   value={title}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="col-12 py-3">
//                 <ReactTagInput
//                   tags={tags}
//                   placeholder="Tags"
//                   onChange={handleTags}
//                 />
//               </div>
//               <div className="col-12 py-3">
//                 <p className="trending">Is it trending blog?</p>
//                 <div className="form-check-inline mx-2">
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     value="yes"
//                     name="radioOption"
//                     checked={trending === "yes"}
//                     onChange={handleTrending}
//                   />
//                   <label className="form-check-label">Yes</label>
//                   <input
//                     type="radio"
//                     className="form-check-input"
//                     value="no"
//                     name="radioOption"
//                     checked={trending === "no"}
//                     onChange={handleTrending}
//                   />
//                   <label className="form-check-label">No</label>
//                 </div>
//               </div>
//               <div className="col-12 py-3">
//                 <select
//                   value={category}
//                   onChange={onCategoryChange}
//                   className="catg-dropdown"
//                 >
//                   <option>Please select category</option>
//                   {categoryOption.map((option, index) => (
//                     <option value={option} key={index}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-12 py-3">
//                 <textarea
//                   className="form-control description-box"
//                   placeholder="Description"
//                   value={description}
//                   name="description"
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   onChange={(e) => setFile(e.target.files[0])}
//                 />
//               </div>
//               {progress !== null && (
//                 <div className="col-12 py-3">
//                   <progress value={progress} max="100" />
//                 </div>
//               )}
//               <div className="col-12 py-3 text-center">
//                 <button
//                   className="btn btn-add"
//                   type="submit"
//                   disabled={progress !== null && progress < 100}
//                 >
//                   {id ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditBlog;


import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
  comments: [],
  likes: [],
};

const categoryOptions = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

const AddEditBlog = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { title, tags, category, trending, description } = form;

  useEffect(() => {
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image uploaded to Firebase successfully");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    }
  }, [file]);

  useEffect(() => {
    if (id) {
      getBlogDetail();
    }
  }, [id]);

  const getBlogDetail = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setForm({ ...snapshot.data() });
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
    setActive(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags });
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags.length > 0 && title && description && trending) {
      try {
        const blogData = {
          ...form,
          timestamp: serverTimestamp(),
          author: user.displayName,
          userId: user.uid,
        };

        if (!id) {
          await addDoc(collection(db, "blogs"), blogData);
          toast.success("Blog created successfully");
        } else {
          await updateDoc(doc(db, "blogs", id), blogData);
          toast.success("Blog updated successfully");
        }

        navigate("/");
      } catch (error) {
        console.error("Error submitting blog:", error);
        toast.error("Failed to submit blog. Please try again.");
      }
    } else {
      toast.error("All fields are mandatory to fill");
    }
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
            {id ? "Update Blog" : "Create Blog"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <ReactTagInput
                  tags={tags}
                  placeholder="Tags"
                  onChange={handleTags}
                />
              </div>
              <div className="col-12 py-3">
                <p className="trending">Is it trending blog?</p>
                <div className="form-check-inline mx-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="yes"
                    name="radioOption"
                    checked={trending === "yes"}
                    onChange={handleTrending}
                  />
                  <label className="form-check-label">Yes</label>
                  <input
                    type="radio"
                    className="form-check-input"
                    value="no"
                    name="radioOption"
                    checked={trending === "no"}
                    onChange={handleTrending}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              <div className="col-12 py-3">
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className="catg-dropdown"
                >
                  <option>Please select category</option>
                  {categoryOptions.map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 py-3">
                <textarea
                  className="form-control description-box"
                  placeholder="Description"
                  value={description}
                  name="description"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              {progress !== null && (
                <div className="col-12 py-3">
                  <progress value={progress} max="100" />
                </div>
              )}
              <div className="col-12 py-3 text-center">
                <button
                  className="btn btn-add"
                  type="submit"
                  disabled={progress !== null && progress < 100}
                >
                  {id ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlog;
