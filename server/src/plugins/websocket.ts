import { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import { appEventEmitter } from '../lib/event-emitter';
import { LINK_STATS_UPDATED_EVENT } from '../events';

export const registerWebSocket = async (app: FastifyInstance) => {
  await app.register(websocket);

  app.get('/ws', { websocket: true }, (socket, _request) => {
    app.log.info('New WebSocket connection established');

    const listener = (payload: { linkId: string; accessCount: number }) => {
      console.log('Sending link stats update to WebSocket', payload);
      if (socket.readyState === 1) {
        socket.send(
          JSON.stringify({
            type: 'LINK_STATS_UPDATED',
            payload,
          })
        );
      }
    };

    appEventEmitter.on(LINK_STATS_UPDATED_EVENT, listener);

    const keepAliveInterval = setInterval(() => {
      if (socket.readyState === 1) {
        socket.ping();
      }
    }, 30000);

    socket.on('close', () => {
      app.log.info('WebSocket connection closed');
      clearInterval(keepAliveInterval);
      appEventEmitter.off(LINK_STATS_UPDATED_EVENT, listener);
    });

    socket.on('error', (err: Error) => {
      app.log.error(err, 'WebSocket error');
      clearInterval(keepAliveInterval);
      appEventEmitter.off(LINK_STATS_UPDATED_EVENT, listener);
    });
  });
};
