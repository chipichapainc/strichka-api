import { AccessKey } from "../builders/access-builder/access-key";

export type SingleOrMultipleAccessKeys = AccessKey | AccessKey[];
export type SingleOrMultipleAccessKeysValidationResult<T extends SingleOrMultipleAccessKeys> = T extends AccessKey[] ? boolean[] : boolean;