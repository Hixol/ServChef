import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { CONSTANTS } from "../constants.js";
import { useAuthContext } from "../context/authContext.jsx";

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const { user } = useAuthContext();

    useEffect(() => {
        if (user && user.token) {
            const newSocket = io(`${CONSTANTS.SOCKET_URL}`, {
                auth: {
                    token: user.token,
                    user_id: user.role[0].user_id,
                    role: user.staff_role_name,
                    location_id: user.role[0].staff_location_id
                },
                reconnection: true,
                reconnectionDelay: 5000,
                reconnectionDelayMax: 10000,
                reconnectionAttempts: 1000,
            });

            socketRef.current = newSocket;
            setSocket(newSocket);
            setIsConnected(true);

            newSocket.on("connect", () => {
                console.log("connected");
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("disconnected");
                setIsConnected(false);
            });

            newSocket.on("connect_error", (err) => {
                console.log("Connection Error", err);
            });

            newSocket.on("reconnect_error", (err) => {
                console.log("Reconnection Error", err);
            });

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [user, isConnected]);

    return <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>{children}</SocketContext.Provider>;
}
