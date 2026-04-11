export const mockMMKV = {
  createMMKV: () => ({
    set: jest.fn(),
    getBoolean: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBuffer: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    contains: jest.fn(),
    getAllKeys: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  }),
};
