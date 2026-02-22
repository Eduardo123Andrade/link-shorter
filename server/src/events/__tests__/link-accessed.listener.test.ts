import {
  setupLinkAccessedListener,
  LINK_ACCESSED_EVENT,
} from '../link-accessed.listener';
import { appEventEmitter } from '../../lib/event-emitter';
import { registerLinkAccess } from '../../use-case';

jest.mock('../../use-case');

describe('LinkAccessedListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    appEventEmitter.removeAllListeners();
  });

  it('should call registerLinkAccess when LINK_ACCESSED event is emitted', async () => {
    // Arrange
    setupLinkAccessedListener();
    const payload = { linkId: '123' };
    const mockLink = { id: '123', accessCount: 10 };
    (registerLinkAccess as jest.Mock).mockResolvedValue(mockLink);

    // Act
    appEventEmitter.emit(LINK_ACCESSED_EVENT, payload);

    // Wait for async event handling
    await new Promise((resolve) => process.nextTick(resolve));

    // Assert
    expect(registerLinkAccess).toHaveBeenCalledWith(payload);
  });

  it('should handle error when registerLinkAccess fails', async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    setupLinkAccessedListener();
    const payload = { linkId: '123' };
    const error = new Error('Database error');
    (registerLinkAccess as jest.Mock).mockRejectedValue(error);

    // Act
    appEventEmitter.emit(LINK_ACCESSED_EVENT, payload);

    // Wait for async event handling
    await new Promise((resolve) => process.nextTick(resolve));

    // Assert
    expect(registerLinkAccess).toHaveBeenCalledWith(payload);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to register access'),
      error
    );

    consoleSpy.mockRestore();
  });
});
