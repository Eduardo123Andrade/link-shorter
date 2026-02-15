import { useEffect } from 'react';
import { useLinkStore } from '../store/linkStore';

import { WS_URL } from '../lib/api';

export function useRealtimeUpdates() {
  const updateLinkStats = useLinkStore((state) => state.updateLinkStats);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => { };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'LINK_STATS_UPDATED') {
            const { linkId, accessCount } = data.payload;
            updateLinkStats(linkId, accessCount);
          }
        } catch (error) { }
      };

      socket.onclose = () => {
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
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
