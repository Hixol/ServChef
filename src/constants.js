//DEVELOPMENT CONSTANTS
const DEV_CONSTANTS = {
  BASE_URL: "http://localhost:3002",
  PANEL_URL: "http://localhost/restaurants",
  API_URL: "http://192.168.100.69:4000",
  WEB_URL: "http://localhost:3002",
  SOCKET_URL: "https://server.servall.co.uk",
  REQUEST_HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};
//PRODUCTION CONSTANTS
const PROD_CONSTANTS = {
  BASE_URL: "https://app.servall.co.uk",
  PANEL_URL: "",
  API_URL: "https://server.servall.co.uk",
  WEB_URL: "https://app.servall.co.uk",
  SOCKET_URL: "https://server.servall.co.uk",
  REQUEST_HEADERS: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};
//Made seperate URLS for clean code
const URLS = {
  LOGIN: "/sessions/manager",
  GETPRINTERDATA: "/orders/live",
  GETDIRECTORDERSDATA: "/direct_orders/servchef/orders",

  UPDATECARDSTATUS: (locationId, orderId) =>
    `/servchef/${locationId}/orders/${orderId}`,
  GETALLNOTIFICATIONS: (locationId, page) =>
    `/locationSessions/allNotifications/${locationId}?page=${page}`,
  UPDATENOTIFICATIONS: (locationId, notification_id) =>
    `/locationSessions/${locationId}/notificationSeen/${notification_id}`,
};

//checking Constatns based on ENV
const CONSTANTS =
  process.env.REACT_APP_STAGE === "DEV"
    ? DEV_CONSTANTS
    : PROD_CONSTANTS;

// Exporting both CONSTANTS and URLS
export { CONSTANTS, URLS };
