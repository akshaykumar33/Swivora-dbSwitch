/**
 * Abstraction for transaction savepoints.
 * Emulates sub-transactions when target engines do not natively support savepoints.
 *
 * @public
 */
export interface SavepointHandle {
  readonly name: string;
  release(): Promise<void>;
  rollbackTo(): Promise<void>;
}

/**
 * Savepoint Manager for sub-transaction lifecycle tracking.
 *
 * @public
 */
export class SavepointManager {
  private counter = 0;
  private readonly activeSavepoints: string[] = [];

  public createSavepointName(): string {
    const name = `sp_${++this.counter}_${Date.now()}`;
    this.activeSavepoints.push(name);
    return name;
  }

  public releaseSavepoint(name: string): void {
    const idx = this.activeSavepoints.indexOf(name);
    if (idx !== -1) {
      this.activeSavepoints.splice(idx, 1);
    }
  }
}
