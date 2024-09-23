import {createContext, useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {CONSTANTS} from "../constants.js";
import {useAuthContext} from "../context/authContext.jsx";

export const useSocketContext = () => {
    return useContext(SocketContext)
}

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const {user} = useAuthContext();

    useEffect(() => {
        if (user && user.token) {
            const socket = io(`${CONSTANTS.SOCKET_URL}`, {
                auth: {
                    token: user.token,
                    user_id: user.role[0].user_id,
                    role: user.staff_role_name,
                    location_id: user.role[0].staff_location_id
                },
                reconnection: true,
                reconnectionDelay: 5000,
                reconnectionDelayMax: 10000,
                reconnectionAttempts: 15
            })

            setSocket(socket);

            socket.on("connect", () => {
                console.log("connected")
            })

            socket.on("disconnect", () => {
                console.log("disconnected")
            })

            socket.on("connect_error", (err) => {
                console.log("Connection Error", err)
            })

            socket.on("reconnect_error", (err) => {
                console.log("Reconnection Error", err)
            })

            return () => socket.close()
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}