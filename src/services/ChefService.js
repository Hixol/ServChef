import axios from "axios";
import { CONSTANTS, URLS } from "../constants";
import LoginService from "./LoginService";

export default {
  getAllPrinter,
  updateOrderStatus,
};

async function getAllPrinter() {
  try {
    const { token } = LoginService.getToken();
    const response = await axios.post(
      `${CONSTANTS.API_URL}${URLS.GETPRINTERDATA}`,
      {
        filter: "live_orders",
        sort: "ASC",
        limit: 10,
        page: 0,
        fortabs: true,
      },
      {
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
          "X-ACCESS-TOKEN": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Could not fetch all printer data: " + error.message);
  }
}

async function updateOrderStatus(locationId, newRole, orderId, newStatus) {
  try {
    const { token } = LoginService.getToken();
    const response = await axios.post(
      `${CONSTANTS.API_URL}${URLS.UPDATECARDSTATUS(locationId, orderId)}`,
      { order_status: newStatus, role: newRole },
      {
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
          "X-ACCESS-TOKEN": token,
        },
      }
    );
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to update order status");
    }
  } catch (error) {
    throw new Error("Could not update printer data: " + error.message);
  }
}
