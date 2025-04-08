import { AccessKey, EAccessKeyType } from "./access-key";

export class AccessKeyBuilder {
    private accessKey: AccessKey;

    constructor(type: EAccessKeyType) {
        this.accessKey = new AccessKey(type);
    }

    static forUser(userId: string): AccessKeyBuilder {
        const builder = new AccessKeyBuilder(EAccessKeyType.USER);
        builder.accessKey.key.push(userId);
        return builder;
    }

    to(...args: string[]): AccessKeyBuilder {
        if (args.length === 0)
            throw new Error('At least one argument is required');
        if (args.length % 2 === 1)
            args.push('*');
        this.accessKey.key.push(...args);
        return this;
    }

    build(): AccessKey {
        return this.accessKey;
    }   

    buildAll(): AccessKey[] {
        const wildcardAccess = this.accessKey.copy();
        wildcardAccess.key[wildcardAccess.key.length - 1] = '*';
        return [
            this.accessKey,
            wildcardAccess
        ]
    }
}