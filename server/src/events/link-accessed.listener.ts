import { appEventEmitter } from '../lib/event-emitter';
import { registerLinkAccess } from '../use-case';

export const LINK_ACCESSED_EVENT = 'LINK_ACCESSED';

export interface LinkAccessedPayload {
  linkId: string;
}

export const setupLinkAccessedListener = () => {
  appEventEmitter.on(
    LINK_ACCESSED_EVENT,
    async (payload: LinkAccessedPayload) => {
      try {
        await registerLinkAccess({ linkId: payload.linkId });
        console.log(
          `[LinkAccessed] Successfully registered access for link ${payload.linkId}`
        );
      } catch (error) {
        console.error(
          `[LinkAccessed] Failed to register access for link ${payload.linkId}`,
          error
        );
      }
    }
  );
};
