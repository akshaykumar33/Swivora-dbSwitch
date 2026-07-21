/**
 * Granular Database Capability Flags for runtime capability detection.
 *
 * @public
 */
export enum Capability {
  ACID_TRANSACTIONS = 'ACID_TRANSACTIONS',
  RELATIONAL_JOINS = 'RELATIONAL_JOINS',
  NESTED_DOCUMENTS = 'NESTED_DOCUMENTS',
  JSON_PATH_SEARCH = 'JSON_PATH_SEARCH',
  SAVEPOINTS = 'SAVEPOINTS',
  RETURNING_CLAUSE = 'RETURNING_CLAUSE',
  FULLTEXT_SEARCH = 'FULLTEXT_SEARCH',
}

/**
 * Immutable Capability Set helper class.
 *
 * @public
 */
export class CapabilitiesSet {
  private readonly flags: ReadonlySet<Capability>;

  constructor(capabilities: Iterable<Capability>) {
    this.flags = Object.freeze(new Set(capabilities));
    Object.freeze(this);
  }

  public has(capability: Capability): boolean {
    return this.flags.has(capability);
  }

  public assertSupported(capability: Capability, actionName: string): void {
    if (!this.has(capability)) {
      throw new Error(
        `Capability mismatch: Action '${actionName}' requires capability '${capability}' which is not supported by the attached database adapter.`
      );
    }
  }

  public toArray(): ReadonlyArray<Capability> {
    return Array.from(this.flags);
  }
}
