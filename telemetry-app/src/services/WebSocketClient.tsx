import Constants from 'expo-constants';

const WS_URL = Constants.expoConfig?.extra?.WS_URL ?? 'ws://192.168.0.12:8080';


export type TelemetryData = {
  rpm: number;
  speed: number;
  gear: number;
};

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private onMessageCallback: ((data: TelemetryData) => void) | null = null;

  connect(onMessage: (data: TelemetryData) => void) {
    this.onMessageCallback = onMessage;
    this.ws = new window.WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected:', WS_URL);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
