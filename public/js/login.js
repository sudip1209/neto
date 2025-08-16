// import axios from "axios";

// export const login = async (email, password) => {
//   console.log(email, password);

//   try {
//     const res = await axios({
//       method: "POST",
//       url: "http://127.0.0.1:3000/api/v1/users/login",
//       withCredentials: true,
//       data: {
//         email,
//         password,
//       },
//     });
//     if (res.data.status === "success") {
//       showAlert("success", "Logged in successfully!");
//       window.setTimeout(() => {
//         location.assign("/");
//       }, 1500);
//     }
//     console.log("Logged in successfully!");
//     // console.log(res.data);
//   } catch (err) {
//     console.log("error", err.response);
//   }
// };
import axios from "axios";
import { showAlert } from "./alerts";
export const login = async (email, password) => {
  console.log(email, password);

  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      withCredentials: true, // Allows credentials to be sent with the request (cookies, etc.)
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      // Show success alert and redirect after 1.5 seconds
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/"); // Redirect to homepage or dashboard
      }, 1500);
    }

    console.log("Logged in successfully!");
  } catch (err) {
    // Improved error logging
    console.error(
      "Login error:",
      err.response?.data?.message || err.message || err
    );

    // Optionally show alert to the user
    showAlert("error", "Login failed. Please try again.");
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
      withCredentials: true,
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    console.error(
      "Logout error:",
      err.response?.data?.message || err.message || err
    );
    showAlert("error", "Error logging out. Please try again.");
  }
};
