import axios from "axios";
import {
  clearLocalStorage,
  getItemLocalStorage,
} from "../../Utils/browserServices";
import { baseUrl } from "../../Api/apiConfig";

const getTokenFromCookies = () => {
  const cookieName = "token=";
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookies.split(";");
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_USER_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  // const token = getItemLocalStorage("token");
  let token = localStorage.getItem("token") || getTokenFromCookies();
  // config.headers = {
  //   Authorization: `Bearer ${token}`,
  //     "Content-Type": "multipart/form-data",
  //   "Content-Type": "application/json",
  // };
  if (config.data instanceof FormData) {
    // If it's FormData, set the Content-Type as multipart/form-data
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };
  } else {
    // Otherwise, set Content-Type to application/json
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    console.log("Network error - make sure API is running!");
  }
  if (error.response) {
    const { status } = error.response;
    if (status === 404) {
      console.log("Not Found");
    }
    if (status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
        clearLocalStorage();
        console.log("Your session has expired, please login again");
      }
    }
    return error.response;
  } else {
    console.log("error", error);
    return error;
  }
});

export default axiosInstance;
