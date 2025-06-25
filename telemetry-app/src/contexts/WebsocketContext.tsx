import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WebSocketClient, TelemetryData } from '../services/WebSocketClient';

interface WebsocketContextType {
  rpm: number;
  speed: number;
  gear: number;
}

const initialState: WebsocketContextType = {
  rpm: 0,
  speed: 0,
  gear: 0,
};

const WebsocketContext = createContext<WebsocketContextType>(initialState);

export const useWebsocket = () => useContext(WebsocketContext);

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const [telemetry, setTelemetry] = useState<WebsocketContextType>(initialState);

  useEffect(() => {
    const client = new WebSocketClient();
    client.connect((data: TelemetryData) => {
      setTelemetry({
        rpm: data.rpm,
        speed: Math.round(data.speed), // format speed as integer
        gear: data.gear,
      });
    });
    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <WebsocketContext.Provider value={telemetry}>
      {children}
    </WebsocketContext.Provider>
  );
};
