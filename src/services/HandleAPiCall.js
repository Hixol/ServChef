import axios from "axios";
import CONSTANTS from "../constants";
//  url of the api
// if vite - use import.meta.env.VITE_API_URL
// if react - use process.env.REACT_APP_API_URL

const url = `${CONSTANTS.API_URL}/sessions/manager`;

const handleApiCall = ({ data, cb, setLoading }) => {
  console.log("DATA", data);
  const modifiedData = {
    email: data.userName,
    password: data.password,
    tab_device_token: data.tab_device_token,
    is_tab_login: data.is_tab_login,
  };

  async function handelCall() {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url,
        data: JSON.stringify(modifiedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);

      return cb(response.data, response.status);
    } catch (error) {
      setLoading(false);

      cb(error, error.message);

      console.log(error.response?.data?.message);
      throw error;
    }
  }

  return handelCall();
};

export default handleApiCall;
