import { describe, it, expect } from 'vitest';
import { Capability, CapabilitiesSet, SavepointManager } from '../src/index.js';

describe('@morphdb/adapter-sdk Capabilities & Savepoint Manager', () => {
  it('should assert supported capabilities accurately', () => {
    const caps = new CapabilitiesSet([Capability.ACID_TRANSACTIONS, Capability.RELATIONAL_JOINS]);

    expect(caps.has(Capability.ACID_TRANSACTIONS)).toBe(true);
    expect(caps.has(Capability.SAVEPOINTS)).toBe(false);

    expect(() => caps.assertSupported(Capability.ACID_TRANSACTIONS, 'beginTransaction')).not.toThrow();
    expect(() => caps.assertSupported(Capability.SAVEPOINTS, 'createSavepoint')).toThrowError(
      /Capability mismatch/
    );
  });

  it('should manage savepoint names deterministically', () => {
    const manager = new SavepointManager();
    const sp1 = manager.createSavepointName();
    const sp2 = manager.createSavepointName();

    expect(sp1).toContain('sp_1_');
    expect(sp2).toContain('sp_2_');

    manager.releaseSavepoint(sp1);
  });
});
