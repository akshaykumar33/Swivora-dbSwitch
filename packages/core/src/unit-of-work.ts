import { IdentityMap } from './identity-map.js';

/**
 * Entity State classification within UnitOfWork.
 *
 * @public
 */
export enum EntityState {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  NEW = 'NEW',
  DELETED = 'DELETED',
}

/**
 * Tracked Entity Record wrapper inside UnitOfWork.
 *
 * @public
 */
export interface TrackedEntity<T = unknown> {
  readonly entityName: string;
  readonly primaryKey: string | number;
  readonly entity: T;
  state: EntityState;
}

/**
 * Unit of Work manager for tracking entity mutations within transactional scopes.
 *
 * @public
 */
export class UnitOfWork {
  private readonly trackedEntities = new Map<string, TrackedEntity>();

  constructor(private readonly identityMap: IdentityMap) {}

  private buildKey(entityName: string, primaryKey: string | number): string {
    return `${entityName}:${primaryKey}`;
  }

  public registerClean<T>(entityName: string, primaryKey: string | number, entity: T): T {
    const registered = this.identityMap.register<T>(entityName, primaryKey, entity);
    const key = this.buildKey(entityName, primaryKey);

    if (!this.trackedEntities.has(key)) {
      this.trackedEntities.set(key, {
        entityName,
        primaryKey,
        entity: registered,
        state: EntityState.CLEAN,
      });
    }

    return registered;
  }

  public registerDirty<T>(entityName: string, primaryKey: string | number, entity: T): void {
    const key = this.buildKey(entityName, primaryKey);
    const tracked = this.trackedEntities.get(key);
    if (tracked) {
      tracked.state = EntityState.DIRTY;
    } else {
      this.trackedEntities.set(key, {
        entityName,
        primaryKey,
        entity,
        state: EntityState.DIRTY,
      });
    }
  }

  public getTrackedEntities(): ReadonlyArray<TrackedEntity> {
    return Array.from(this.trackedEntities.values());
  }

  public clear(): void {
    this.trackedEntities.clear();
    this.identityMap.clear();
  }
}
