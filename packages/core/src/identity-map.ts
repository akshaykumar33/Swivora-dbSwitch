/**
 * Identity Map implementation for transactional object reference equality tracking.
 * Prevents duplicate object instantiations within a single execution context.
 *
 * @public
 */
export class IdentityMap {
  private readonly instances = new Map<string, unknown>();

  private buildKey(entityName: string, primaryKey: string | number): string {
    return `${entityName}:${primaryKey}`;
  }

  public get<T>(entityName: string, primaryKey: string | number): T | undefined {
    return this.instances.get(this.buildKey(entityName, primaryKey)) as T | undefined;
  }

  public register<T>(entityName: string, primaryKey: string | number, instance: T): T {
    const key = this.buildKey(entityName, primaryKey);
    const existing = this.instances.get(key);
    if (existing) {
      return existing as T;
    }
    this.instances.set(key, instance);
    return instance;
  }

  public clear(): void {
    this.instances.clear();
  }
}
