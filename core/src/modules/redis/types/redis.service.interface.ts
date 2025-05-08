type TRedisSetExpirationOptions = { existForMs?: number } | { expiresAt?: Date | number | string }
type TRedisSetGuardsOptions = { ifExists?: boolean } | { ifNotExists?: boolean }
type TRedisSetTtlOptions = { keepTtl?: boolean }
type TRedisSetReturnOptions = { returnOldValue?: boolean }

export type TRedisSetOptions = TRedisSetExpirationOptions 
    & TRedisSetGuardsOptions 
    & TRedisSetTtlOptions 
    & TRedisSetReturnOptions

export interface IRedisService {
    multi(): any;
    set(key: string, value: string, options?: TRedisSetOptions): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}