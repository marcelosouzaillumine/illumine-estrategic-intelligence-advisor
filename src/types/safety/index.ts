export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue; }
export interface JsonArray extends Array<JsonValue> {}

export type SafeRecord<T = unknown> = Record<string, T>;
export type UnknownRecord = Record<string, unknown>;

export interface FinancialPayloadLike extends SafeRecord {}
export interface GovernancePayloadLike extends SafeRecord {}
