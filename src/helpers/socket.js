import io from "socket.io-client";

import LoginService from "../services/LoginService";
import LocationService from "../services/LocationService";
import CONSTANTS from "../constants";
class SocketService {
  constructor(url, token, location) {
    this.url = url;
    this.socket = null;
    this.token = token;
    this.role = role;
    this.location = location;
    this.tries = 0;
    this.connect();
  }
  componentDidMount() {
    console.log(this.url, this.token, location);
  }

  connect() {
    this.socket = io(this.url, {
      auth: {
        token: this.token?.token,
        location_id: this.location,
        role: this.role,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 15,
    });

    this.socket.on("connect", () => {
      console.log("Socket Connected", this.socket);

      this.socket.emit("joinSession");
      this.socket.emit("room");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("connect_timeout", (timeout) => {
      console.error("Socket connection timeout:", timeout);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed");
    });
  }

  on(eventName, callback) {
    this.socket.on(eventName, callback);
  }

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }

  removeListener(eventName, callback) {
    this.socket.removeListener(eventName, callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

let token = LoginService.getToken();
console.log("TOKEN", token);
let location = LocationService.getLocation();
console.log("LOCATION", location);
let role = localStorage.getItem("staff_role_name");
const SOCKET_URL = CONSTANTS.API_URL;
console.log("SOCEKET", SOCKET_URL);
export default new SocketService(SOCKET_URL, token, location);
