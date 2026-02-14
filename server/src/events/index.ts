import { setupLinkAccessedListener } from './link-accessed.listener';

export const setupEventListeners = () => {
  setupLinkAccessedListener();
};

export { LINK_ACCESSED_EVENT } from './link-accessed.listener';
