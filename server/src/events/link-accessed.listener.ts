import { appEventEmitter } from '../lib/event-emitter';
import { registerLinkAccess } from '../use-case';

export const LINK_ACCESSED_EVENT = 'LINK_ACCESSED';
export const LINK_STATS_UPDATED_EVENT = 'LINK_STATS_UPDATED';

export interface LinkAccessedPayload {
  linkId: string;
}

export const setupLinkAccessedListener = () => {
  appEventEmitter.on(
    LINK_ACCESSED_EVENT,
    async (payload: LinkAccessedPayload) => {
      try {
        const updatedLink = await registerLinkAccess({ linkId: payload.linkId });

        appEventEmitter.emit(LINK_STATS_UPDATED_EVENT, {
          linkId: updatedLink.id,
          accessCount: updatedLink.accessCount,
        });

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
