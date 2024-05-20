import { CONSTANTS, URLS } from "../constants";
import LoginService from "./LoginService";
import axios from "axios";

export default {
  getLocation,
  getAllNotificationForWeb,
  updateNavBarNotificationStatus,
};

async function getLocation() {
  const data = JSON.parse(localStorage.getItem("userData"));
  return data ? data.layout_setting.loc_id : null;
}
async function getAllNotificationForWeb(locationId, page = 0) {
  try {
    const { token } = LoginService.getToken();
    const response = await axios.get(
      `${CONSTANTS.API_URL}${URLS.GETALLNOTIFICATIONS(locationId, page)}`,
      {
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
          "X-ACCESS-TOKEN": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Could not get notifications: " + error.message);
  }
}

async function updateNavBarNotificationStatus(locationId, notification_id) {
  try {
    const { token } = LoginService.getToken();
    const response = await axios.get(
      `${CONSTANTS.API_URL}${URLS.UPDATENOTIFICATIONS(
        locationId,
        notification_id
      )}`,
      {
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
          "X-ACCESS-TOKEN": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Could not update notifications: " + error.message);
  }
}
