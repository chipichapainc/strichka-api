
export enum EAccessKeyType {
    USER = 'u',
}

export class AccessKey {
    readonly type: EAccessKeyType;
    readonly key: string[];

    constructor(type: EAccessKeyType, key: string[] = []) {
        this.type = type;
        this.key = key;
    }

    copy(): AccessKey {
        return new AccessKey(this.type, [...this.key]);
    }

    toString(): string {
        return `a:${this.type}/${this.key.join('/')}`;
    }
}