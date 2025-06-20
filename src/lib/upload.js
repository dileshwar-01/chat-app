// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";

//   const upload = async (file) => {
//   const storage = getStorage();
//   const storageRef = ref(storage, `images/${Date.now()+file.name}`);

//   const uploadTask = uploadBytesResumable(storageRef, file);

//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       switch (snapshot.state) {
//         case "paused":
//           console.log("Upload is paused");
//           break;
//         case "running":
//           console.log("Upload is running");
//           break;
//       }
//     },
//     (error) => {},
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         return(downloadURL)
//       });
//     }
//   );
// };

// export default upload ;


import axios from "axios";

const upload = async (file, onProgress) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "chatAppUploads"); // <-- Your preset name
  data.append("cloud_name", "dqmwpih8n"); // <-- Your cloud name
  data.append("folder", "chat_uploads"); // <-- Optional but recommended

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dqmwpih8n/auto/upload",
      data,
      {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          if (onProgress) onProgress(progress.toFixed(0));
        },
      }
    );

    // Cloudinary gives secure URL of uploaded media
    return res.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return null;
  }
};

export default upload;
