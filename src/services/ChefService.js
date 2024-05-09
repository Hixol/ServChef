import CONSTANTS from "../constants";
import LoginService from "./LoginService";
import axios from "axios";
export default {
  getAllPrinter,
  updateOrderStatus,
};

async function getAllPrinter() {
  try {
    const { token } = LoginService.getToken();

    const response = await axios.post(
      `${CONSTANTS.API_URL}/orders/live`,
      {
        filter: "live_orders",
        sort: "DESC",
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
    console.error("Error fetching getAllPrinterData:", error);
    throw new Error("Could not fetch getAllPrinterData");
  }
}
// async function getAllPrinter() {
//   let { token } = LoginService.getToken();

//   let response = await fetch(`${CONSTANTS.API_URL}/orders/live`, {
//     method: "POST",
//     headers: { ...CONSTANTS.REQUEST_HEADERS, "X-ACCESS-TOKEN": token },
//     body: JSON.stringify({
//       filter: "live_orders",
//       sort: "DESC",
//       limit: 0,
//       page: 0,
//       fortabs: true,
//     }),
//   });
//   response = await response.json();
//   if (response) return response;
//   throw new Error("Could not fetch getAllPrinterData");
// }
async function updateOrderStatus(locationId, newRole, orderId, newStatus) {
  console.log(locationId, newRole, orderId, newStatus);
  try {
    const { token } = LoginService.getToken();
    const response = await fetch(
      `${CONSTANTS.API_URL}/servchef/${locationId}/orders/${orderId}`,

      {
        method: "POST",
        headers: {
          ...CONSTANTS.REQUEST_HEADERS,
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": token,
        },
        body: JSON.stringify({ order_status: newStatus, role: newRole }),
      }
    );
    if (response.ok) {
      const updatedOrder = await response.json();
      return updatedOrder;
    } else {
      throw new Error("Failed to update order status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
