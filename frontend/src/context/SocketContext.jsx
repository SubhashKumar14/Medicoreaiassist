import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('authToken'),
            },
            autoConnect: false // Connect manually after login
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const connectSocket = () => {
        if (socket && !socket.connected) {
            // Refresh token if needed
            socket.auth.token = localStorage.getItem('authToken');
            socket.connect();
        }
    };

    const disconnectSocket = () => {
        if (socket && socket.connected) {
            socket.disconnect();
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
