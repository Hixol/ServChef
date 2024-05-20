import axios from "axios";
import { CONSTANTS, URLS } from "../constants";
//  url of the api
// if vite - use import.meta.env.VITE_API_URL
// if react - use process.env.REACT_APP_API_URL

const url = `${CONSTANTS.API_URL}${URLS.LOGIN}`;

const handleApiCall = ({ data, cb, setLoading }) => {
  const LoginData = {
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
        data: JSON.stringify(LoginData),
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
        },
      });
      setLoading(false);
      return cb(response.data, response.status);
    } catch (error) {
      setLoading(false);
      cb(error, error.message);

      throw error;
    }
  }

  return handelCall();
};

export default handleApiCall;
