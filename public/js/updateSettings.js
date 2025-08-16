import axios from "axios";
import { showAlert } from "./alerts";

// export const userData = async (name, email) => {
//   console.log(name, email);
//   try {
//     const res = await axios({
//       method: "PATCH",
//       url: "http://127.0.0.1:3000/api/v1/users/updateMe",
//       withCredentials: true,
//       data: {
//         name,
//         email,
//       },
//     });
//     if (res.data.status === "success") {
//       // Show success alert and redirect after 1.5 seconds
//       showAlert("success", "User Data updated successfully!");
//       //   window.setTimeout(() => {
//       //     location.assign("/me"); // Redirect to homepage or dashboard
//       //   }, 1500);
//     }
//   } catch (err) {
//     console.error("Login error:", err.response.message);

//     // Optionally show alert to the user
//     showAlert("error", err.response.message);
//   }
// };

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword"
        : "http://127.0.0.1:3000/api/v1/users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      withCredentials: true,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} Data updated successfully!`);
    }
  } catch (err) {
    // Optionally show alert to the user
    showAlert("error", err.response?.data?.message || err.message || err);
  }
};
