import * as signalR from '@microsoft/signalr';

export interface HealUpNotification {
  type: string;
  message: string;
  [key: string]: unknown;
}

let connection: signalR.HubConnection | null = null;

function getHubUrl() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const path = process.env.NEXT_PUBLIC_SIGNALR_HUB_PATH || '/hubs/notifications';
  return `${api}${path}`;
}

export async function connectRealtime(
  token: string,
  onNotification: (notification: HealUpNotification) => void
) {
  if (!token) return null;

  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on('HealUpNotification', (payload: HealUpNotification) => {
      onNotification(payload);
    });
  }

  if (connection.state === signalR.HubConnectionState.Disconnected) {
    await connection.start();
  }

  return connection;
}

export async function disconnectRealtime() {
  if (!connection) return;
  if (connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
  connection = null;
}
