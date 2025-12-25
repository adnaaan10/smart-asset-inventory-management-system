import axios from "axios"
import apiClient from "./apiClient";

/* LOGIN */

/* for run locally
export async function loginUser(username, password) {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/token/",
    { username, password },
  {
    headers:{
      "Content-Type":"application/json",
    },
  }
  );

  return response.data;
}

*/

// for production

export async function loginUser(username, password) {
  const response = await axios.post(
    "https://smart-asset-inventory-management-system.onrender.com/api/token/",
    { username, password },
  {
    headers:{
      "Content-Type":"application/json",
    },
  }
  );

  return response.data;
}

/* GET CURRENT USER */
export async function getMe() {
  const response = await apiClient.get("accounts/me/");
  return response.data;
}


/* LOGOUT */
export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/* Change Password */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post("accounts/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Password change failed" };
  }
};


export const getUsers = async () => {
  const response = await apiClient.get("accounts/users/");
  return response.data;
};
