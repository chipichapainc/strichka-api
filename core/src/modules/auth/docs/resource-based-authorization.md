# Resource-Based Authorization with ACL

This document describes the implementation of a resource-based authorization system using Access Control Lists (ACL) stored in Redis.

## Overview

The system provides fine-grained access control to resources based on user IDs and resource types. It supports both specific resource access (e.g., a specific post) and wildcard access (e.g., all posts).

## Redis Storage Format

Access permissions are stored in Redis using a hierarchical key structure:

```
a:{type}/{sourceId}/{resourceType}/{resourceId}: {permissions}
```

Where:
- `a` - prefix for all authorization records
- `{type}` - the type of access (e.g., "u" for user-based permissions)
- `{sourceId}` - source of access ID
- `{resourceType}` - the type of resource (e.g., "posts", "channels")
- `{resourceId}` - the ID of the specific resource or "*" for all resources
- `{permissions}` - the granted permissions (e.g., "r" for read, "w" for write, "rw" for both)

## Permission Types

The system supports three types of permissions:
- `r` - Read permission
- `w` - Write permission
- `rw` - Both read and write permissions

These are defined as constants in the `Permissions` enum:
```typescript
export const Permissions = {
    READ: 'r',
    WRITE: 'w',
    READ_WRITE: 'rw',
};
```

## Examples

### Specific Resource Access

When granting read access to a user with ID 1111 for a post with ID 2222:

```
Key: "a:u/1111/posts/2222"
Value: "r"
```

### Wildcard Resource Access

When granting read and write access to a user with ID 2222 for all channels:

```
Key: "a:u/2222/channels/*"
Value: "rw"
```

## Access Checking Logic

The system uses the `AccessService` to verify permissions. When checking access, it:

1. Creates an `AccessKey` using the `AccessKeyBuilder`
2. Checks both specific and wildcard access in a single operation
3. Returns a boolean indicating whether access is granted

### Using the AccessKeyBuilder

```typescript
// Create an access key for a specific resource
const accessKey = AccessKeyBuilder.forUser(userId)
    .to('posts', postId)
    .build();

// Create access keys for both specific and wildcard access
const accessKeys = AccessKeyBuilder.forUser(userId)
    .to('posts', postId)
    .buildAll();
```

### Permission Checking

```typescript
// Check a single permission
const hasAccess = await accessService.verifyAccess(
    accessKey,
    Permissions.READ
);

// Check multiple permissions in a single operation
const hasAccess = await accessService.verifyAccess(
    accessKeys,
    Permissions.READ
);
```

## Implementation Details

### AccessKey Structure

The `AccessKey` class provides a type-safe way to build Redis keys:

```typescript
export class AccessKey {
    readonly type: EAccessKeyType;
    readonly key: string[];

    constructor(type: EAccessKeyType, key: string[] = []) {
        this.type = type;
        this.key = key;
    }

    toString(): string {
        return `a:${this.type}/${this.key.join('/')}`;
    }
}
```

### Permission Checking Algorithm

The `AccessService` implements the following logic:

1. For single access key checks:
   - Get the permission from Redis
   - Compare the granted permission with the required permission
   - Return true if the granted permission includes the required permission

2. For multiple access key checks:
   - Use Redis pipelining to get all permissions in a single round trip
   - Process results in parallel
   - Return an array of boolean values

### Example Usage

```typescript
@Injectable()
export class PostsService {
    constructor(
        private readonly accessService: AccessService,
        private readonly postsRepository: PostsRepository,
    ) {}

    async getPost(userId: string, postId: string): Promise<Post> {
        const accessKey = AccessKeyBuilder.forUser(userId)
            .to('posts', postId)
            .build();

        const hasAccess = await this.accessService.verifyAccess(
            accessKey,
            Permissions.READ
        );

        if (!hasAccess) {
            throw new ForbiddenException('You do not have permission to read this post');
        }

        return this.postsRepository.findOne(postId);
    }
}
```

## Performance Considerations

1. **Redis Key Design**: The hierarchical key structure allows for efficient lookups.

2. **Batch Operations**: The system supports checking multiple permissions in a single Redis operation using pipelining.

3. **Type Safety**: The `AccessKey` and `AccessKeyBuilder` classes provide type-safe ways to build Redis keys.

4. **Flexibility**: The system can be easily extended to support new types of access (e.g., role-based, group-based) by adding new `EAccessKeyType` values.

## Security Considerations

1. **Permission Validation**: The system validates permission strings using TypeScript types.

2. **Least Privilege**: The granular permission system allows granting only the necessary permissions.

3. **Type Safety**: The use of TypeScript types and enums prevents invalid permission values.

4. **Extensibility**: The system can be extended to support more complex permission structures while maintaining type safety.

## Permission Management

### Granting Permissions

```typescript
// Grant read access to a specific post
await authService.grantPermission(userId, 'posts', postId, 'r');

// Grant read and write access to all channels
await authService.grantPermission(userId, 'channels', '*', 'rw');
```

### Revoking Permissions

```typescript
// Revoke all permissions for a specific post
await authService.revokePermission(userId, 'posts', postId);

// Revoke all permissions for all channels
await authService.revokePermission(userId, 'channels', '*');
```

## Extending the System

The ACL system can be extended to support:

1. **Role-Based Access**: Add role prefixes to keys (e.g., `a/r/admin/posts/*`).

2. **Group-Based Access**: Add group prefixes to keys (e.g., `a/g/team1/posts/*`).

3. **Time-Based Permissions**: Use Redis key expiration for temporary permissions.