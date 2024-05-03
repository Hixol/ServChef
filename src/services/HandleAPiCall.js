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
    // loading start
    setLoading(true);
    try {
      // axios call
      const response = await axios({
        method: "POST",
        url,
        data: JSON.stringify(modifiedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      // if success
      return cb(response.data, response.status);
      // if we have error
    } catch (error) {
      // loading false
      setLoading(false);
      //   pass error to the callback
      cb(error, error.message);
      //   console.log error
      console.log(error.response?.data?.message);
      throw error;
    }
  }
  //   return function that we can call it
  return handelCall();
};

export default handleApiCall;
