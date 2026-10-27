export class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  public get length(): number {
    return this.items.size;
  }

  public clear(): void {
    this.items.clear();
  }

  public getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  public key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  public removeItem(key: string): void {
    this.items.delete(key);
  }

  public setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}
