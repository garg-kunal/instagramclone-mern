import { default as axios, AxiosError } from "axios";

const BACKEDN_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const fetcher = (url: string, method: string, data = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: `${BACKEDN_URL}${url}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("loginauth"),
      },
    })
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: AxiosError) => {
        reject(err);
      });
  });
};
