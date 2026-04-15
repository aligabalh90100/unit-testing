export const removeMock = jest.fn();
export const setMock = jest.fn();
export const getMock = jest.fn();
export const mockMMKV = {
  createMMKV: () => ({
    set: setMock,
    getBoolean: jest.fn(),
    getString: getMock,
    getNumber: jest.fn(),
    getBuffer: jest.fn(),
    remove: removeMock,
    clearAll: jest.fn(),
    contains: jest.fn(),
    getAllKeys: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  }),
};
