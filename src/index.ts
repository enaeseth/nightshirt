import {Iterator, Iterable, Seq, Map as ImmutableMap, Record as _Record} from 'immutable'

export type Record<T> = Readonly<T> & Methods<T>
export type MutableRecord<T> = T & Methods<T>

export namespace Record {
    export interface Class<T> {
        new(values?: Partial<T> | Iterable<keyof T, any>): Record<T>
        (values?: Partial<T> | Iterable<keyof T, any>): Record<T>
    }
}

export function makeRecordFactory<T>(defaultValues: T, name?: string): Record.Class<T> {
    return (_Record(defaultValues, name) as any) as Record.Class<T>
}
export default makeRecordFactory

export type Path = any[] | Iterable<any, any>

export interface Methods<T> {
    size: number

    equals(value: any): boolean

    get<K extends keyof T>(key: K, notSetValue?: T[K]): T[K]
    getIn(searchKeyPath: Path, notSetValue?: any): any

    set<K extends keyof T>(key: K, value: T[K]): Record<T>
    setIn(keyPath: Path, value: any): Record<T>

    merge(...iterables: Partial<T>[]): Record<T>
    mergeWith(merger: (previous: any, next: any, key?: keyof T) => any,
              ...iterables: Partial<T>[]): Record<T>
    mergeDeep(...iterables: any[]): Record<T>
    mergeDeepWith(merger: (previous: any, next: any, key?: any) => any,
                  ...iterables: any[]): Record<T>

    update(updater: (value: Record<T>) => Record<T>): Record<T>
    update<K extends keyof T>(key: K, updater: (value: T[K]) => T[K]): Record<T>
    update<K extends keyof T>(key: K, notSetValue: T[K], updater: (value: T[K]) => T[K]): Record<T>
    updateIn(keyPath: Path, updater: (value: any) => any): Record<T>
    updateIn(keyPath: Path, notSetValue: any, updater: (value: any) => any): Record<T>

    delete(key: keyof T): Record<T>
    remove(key: keyof T): Record<T>
    deleteIn(keyPath: Path): Record<T>
    removeIn(keyPath: Path): Record<T>
    clear(): Record<T>

    withMutations(mutator: (mutable: MutableRecord<T>) => void): Record<T>
    wasAltered(): boolean
    asMutable(): MutableRecord<T>
    asImmutable(): Record<T>

    toJS(): T
    toObject(): T
    toMap(): ImmutableMap<keyof T, any>
    toSeq(): Seq.Keyed<keyof T, any>
    toKeyedSeq(): Seq.Keyed<keyof T, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>

    toString(): string
}
