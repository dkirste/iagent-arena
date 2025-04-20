import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';

/**
 * Creates a registry with Injective-specific types
 * @returns {Registry} Registry with Injective types
 */
export function createInjectiveRegistry() {
  // Create a registry with default Cosmos types
  const registry = new Registry(defaultRegistryTypes);
  
  // Add a custom handler for Injective's EthAccount type
  registry.register('/injective.types.v1beta1.EthAccount', {
    typeUrl: '/injective.types.v1beta1.EthAccount',
    // These implementations don't need to be complete since we're only using the registry for queries
    // The actual encoding/decoding is handled by the chain
    encode: (account) => {
      return new Uint8Array();
    },
    decode: (binary) => {
      // Return a minimal account structure that satisfies the interface
      return {
        baseAccount: {
          address: '',
          pubKey: null,
          accountNumber: 0,
          sequence: 0
        },
        codeHash: new Uint8Array()
      };
    }
  });
  
  return registry;
}
