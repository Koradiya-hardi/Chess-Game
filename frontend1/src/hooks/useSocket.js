import { useEffect, useState } from "react";

const WS_URL = "wss://chess-game-l7ss.onrender.com";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }

        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        };
    }, []);

    return socket;
};
