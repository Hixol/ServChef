// // src/constants.js

// const DEV_CONSTANTS = {
//   BASE_URL: "http://localhost:3002",
//   PANEL_URL: "http://localhost/restaurants",
//   API_URL: "http://192.168.100.69:4000",
//   WEB_URL: "http://localhost:3002",
//   SOCKET_URL: "",
// };

// const PROD_CONSTANTS = {
//   BASE_URL: "https://app.servall.be",
//   PANEL_URL: "",
//   API_URL: "https://server.servall.be",
//   WEB_URL: "https://app.servall.be",
//   SOCKET_URL: "",
// };

// console.log(
//   "  import.meta.env.REACT_APP_STAGE",
//   import.meta.env.VITE_REACT_APP_STAGE
// );
// const CONSTANTS =
//   import.meta.env.VITE_REACT_APP_STAGE === "DEV"
//     ? DEV_CONSTANTS
//     : PROD_CONSTANTS;

// export default CONSTANTS;
const DEV_CONSTANTS = {
  BASE_URL: "http://localhost:3002",
  PANEL_URL: "http://localhost/restaurants",
  API_URL: "http://localhost:4000",
  WEB_URL: "http://localhost:3002",
  SOCKET_URL: "",
  REQUEST_HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const PROD_CONSTANTS = {
  BASE_URL: "https://app.servall.be",
  PANEL_URL: "",
  API_URL: "https://server.servall.be",
  WEB_URL: "https://app.servall.be",
  SOCKET_URL: "",
  REQUEST_HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const CONSTANTS =
  import.meta.env.VITE_REACT_APP_STAGE === "DEV"
    ? DEV_CONSTANTS
    : PROD_CONSTANTS;

export default CONSTANTS;
