import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Permission, Permissions } from './types/permission.types';
import { AccessKey } from './builders/access-builder/access-key';
import { SingleOrMultipleAccessKeys, SingleOrMultipleAccessKeysValidationResult } from './types/single-or-multiple-access-keys.type';

@Injectable()
export class AccessService {
    constructor(
        private readonly redisService: RedisService,
    ) { }

    /**
     * Grants access permission to a user for a resource
     * @param accessKey - The access key for the resource
     * @param permission - The permission to grant (e.g., Permissions.READ, Permissions.WRITE, Permissions.READ_WRITE)
     * @returns Promise that resolves when the permission is granted
     */
    async grantAccess(
        accessKey: AccessKey,
        permission: Permission,
    ): Promise<void> {
        await this.redisService.set(accessKey.toString(), permission);
    }

    /**
     * Revokes access permission for a user for a resource
     * @param accessKey - The access key for the resource
     * @returns Promise that resolves when the permission is revoked
     */
    async revokeAccess(
        accessKey: AccessKey,
    ): Promise<void> {
        await this.redisService.del(accessKey.toString());
    }

    /**
     * Verifies if a user has the required permission for one or more resources
     * @param accessKeys - A single access key or array of access keys for the resources
     * @param requiredPermission - The permission to check for (e.g., Permissions.READ, Permissions.WRITE)
     * @returns Promise that resolves to a boolean or array of boolean values indicating access
     */
    async verifyAccess<T extends SingleOrMultipleAccessKeys>(
        accessKeys: T,
        requiredPermission: Permission,
    ): Promise<SingleOrMultipleAccessKeysValidationResult<T>> {
        if (Array.isArray(accessKeys)) {
            if (accessKeys.length === 0) {
                return [] as SingleOrMultipleAccessKeysValidationResult<T>
            }

            // Use Redis pipelining to get all permissions in a single round trip
            const pipeline = this.redisService.multi();

            // Queue GET commands for all keys
            accessKeys.forEach(accessKey => {
                pipeline.get(accessKey.toString());
            });

            // Execute the pipeline and get results
            const results = await pipeline.exec();

            // Process results
            return results.map(permission =>
                permission !== null
                    && this.hasPermission(
                        permission as Permission,
                        requiredPermission
                    )
            ) as SingleOrMultipleAccessKeysValidationResult<T>;
        } else {
            // Get the permission for the access key
            const permission = await this.redisService.get(accessKeys.toString());

            // Check if the user has the required permission
            return permission !== null
                && this.hasPermission(
                    permission as Permission,
                    requiredPermission
                ) as SingleOrMultipleAccessKeysValidationResult<T>;
        }
    }

    /**
     * Verifies if a user has all the required permissions for one or more resources
     * @param accessKeys - A single access key or array of access keys for the resources
     * @param requiredPermissions - The permissions to check for (e.g., Permissions.READ, Permissions.WRITE)
     * @returns Promise that resolves to a boolean indicating if all permissions are granted
     */
    async verifyAllAccess(
        accessKeys: AccessKey[],
        requiredPermissions: Permission,
    ): Promise<boolean> {
        const results = await this.verifyAccess(accessKeys, requiredPermissions);
        return results.every(result => result);
    }
    
    /**
     * Verifies if a user has any of the required permissions for one or more resources
     * @param accessKeys - A single access key or array of access keys for the resources
     * @param requiredPermissions - The permissions to check for (e.g., Permissions.READ, Permissions.WRITE)
     * @returns Promise that resolves to a boolean indicating if any permissions are granted
     */
    async verifyAnyAccess(
        accessKeys: AccessKey[],
        requiredPermissions: Permission,
    ): Promise<boolean> {
        const results = await this.verifyAccess(accessKeys, requiredPermissions);
        return results.some(result => result);
    }

    /**
     * Checks if the granted permission includes the required permission
     * @param grantedPermission - The permission that was granted
     * @param requiredPermission - The permission to check for
     * @returns True if the granted permission includes the required permission
     */
    private hasPermission(grantedPermission: Permission, requiredPermission: Permission): boolean {
        if (grantedPermission === Permissions.READ_WRITE) {
            return true; // 'rw' includes both 'r' and 'w'
        }
        return grantedPermission.includes(requiredPermission);
    }
}