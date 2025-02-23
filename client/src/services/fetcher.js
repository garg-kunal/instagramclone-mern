import axios from "axios";

export const fetcher = (url, method, data = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: `${process.env.REACT_APP_BACKEND_URL}${url}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("loginauth"),
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
