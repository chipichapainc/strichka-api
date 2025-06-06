import { ClassConstructor } from "class-transformer";
import { ConfigFactory } from "@nestjs/config";
import { CryptoEnvConfig } from "./crypto.config";
import { DatabaseEnvConfig } from "./db.config";
import { validateClass } from "src/common/helpers/validate-class.helper";
import { SmtpEnvConfig } from "./smtp.config";
import { ApiEnvConfig } from "./api.config";
import { JwtEnvConfig } from "./jwt.config";
import { RedisEnvConfig } from "./redis.config";

export const configFactoryEnv = <T extends object>(
    cls: ClassConstructor<T>
) => function() {
    const { success, instance, errors } = validateClass(process.env, cls);
    if (!success)
        throw errors[0];
    return instance;
};

export const configFactoryObject = <T extends object>(
    cls: ClassConstructor<T>,
    obj: T
) => function() {
    const { success, instance, errors } = validateClass(obj, cls);
    if (!success)
        throw errors[0];
    return instance;
};

export const joinConfigs = (...configs: ConfigFactory[]) => function() {
    return configs.reduce((prev, curr) => Object.assign(prev, curr()), {});
};

export const cryptoEnvConfig = configFactoryEnv(CryptoEnvConfig);
export const databaseEnvConfig = configFactoryEnv(DatabaseEnvConfig);
export const smtpEnvConfig = configFactoryEnv(SmtpEnvConfig);
export const apiEnvConfig = configFactoryEnv(ApiEnvConfig);
export const jwtEnvConfig = configFactoryEnv(JwtEnvConfig);
export const redisEnvConfig = configFactoryEnv(RedisEnvConfig);