import { useEffect } from 'react';
import { useLinkStore } from '../store/linkStore';

import { WS_URL } from '../lib/api';

export function useRealtimeUpdates() {
  const updateLinkStats = useLinkStore((state) => state.updateLinkStats);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: any;

    function connect() {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        console.log('Connected to WebSocket');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'LINK_STATS_UPDATED') {
            const { linkId, accessCount } = data.payload;
            console.log("Link stats updated", linkId, accessCount);
            updateLinkStats(linkId, accessCount);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket connection closed (code: ${event.code}, reason: ${event.reason}), reconnecting...`);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error', error);
        socket?.close();
      };
    }

    connect();

    return () => {
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [updateLinkStats]);
}
