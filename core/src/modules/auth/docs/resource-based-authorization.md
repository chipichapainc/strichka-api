# Resource-Based Authorization with ACL

This document describes the implementation of a resource-based authorization system using Access Control Lists (ACL) stored in Redis.

## Overview

The system provides fine-grained access control to resources based on user IDs and resource types. It supports both specific resource access (e.g., a specific post) and wildcard access (e.g., all posts).

## Redis Storage Format

Access permissions are stored in Redis using a hierarchical key structure:

```
a/u/{userId}/{resourceType}/{resourceId}: {permissions}
```

Where:
- `a` - prefix for all authorization records
- `u` - indicates this is a user-based permission
- `{userId}` - the ID of the user
- `{resourceType}` - the type of resource (e.g., "posts", "channels")
- `{resourceId}` - the ID of the specific resource or "*" for all resources
- `{permissions}` - the granted permissions (e.g., "r" for read, "w" for write, "rw" for both)

## Permission Types

- `r` - Read permission
- `w` - Write permission
- `rw` - Both read and write permissions

## Examples

### Specific Resource Access

When granting read access to a user with ID 1111 for a post with ID 2222:

```
Key: "a/u/1111/posts/2222"
Value: "r"
```

### Wildcard Resource Access

When granting read and write access to a user with ID 2222 for all channels:

```
Key: "a/u/2222/channels/*"
Value: "rw"
```

## Access Checking Logic

When a repository method is invoked, the system performs the following checks:

1. Check for specific resource access:
   ```
   "a/u/{userId}/{resourceType}/{resourceId}"
   ```

2. Check for wildcard resource access:
   ```
   "a/u/{userId}/{resourceType}/*"
   ```

3. If either key exists and contains the required permission (e.g., 'r' for read operations), access is granted.

## Implementation Details

### Redis Key Structure

The Redis key structure follows a hierarchical pattern that allows for efficient permission lookups:

```
a/u/{userId}/{resourceType}/{resourceId}
```

This structure enables:
- Fast lookups for specific user-resource combinations
- Pattern matching for wildcard permissions
- Easy addition of new permission types

### Permission Checking Algorithm

1. When a user (ID: `userId`) attempts to access a resource (type: `resourceType`, ID: `resourceId`) with permission `permission`:

2. The system checks two Redis keys in order:
   - `a/u/{userId}/{resourceType}/{resourceId}` - For specific resource access
   - `a/u/{userId}/{resourceType}/*` - For wildcard resource access

3. If either key exists and its value contains the required permission, access is granted.

4. If neither key exists or neither contains the required permission, access is denied.

### Example Scenarios

#### Scenario 1: Specific Resource Access

User 1111 attempts to read post 2222:
- Check `a/u/1111/posts/2222` - Contains "r" → Access granted
- If not found, check `a/u/1111/posts/*` - Not found → Access denied

#### Scenario 2: Wildcard Resource Access

User 2222 attempts to read channel 3333:
- Check `a/u/2222/channels/3333` - Not found
- Check `a/u/2222/channels/*` - Contains "rw" → Access granted

## Integration with Repository Methods

Repository methods should be wrapped with permission checks:

```typescript
async getPost(userId: string, postId: string): Promise<Post> {
  // Check if user has read permission for this post
  const hasPermission = await this.authService.checkPermission(
    userId, 
    'posts', 
    postId, 
    'r'
  );
  
  if (!hasPermission) {
    throw new ForbiddenException('You do not have permission to read this post');
  }
  
  // Proceed with fetching the post
  return this.postRepository.findOne(postId);
}
```

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

## Performance Considerations

1. **Redis Key Design**: The hierarchical key structure allows for efficient lookups and pattern matching.

2. **Caching**: Frequently accessed permissions can be cached at the application level to reduce Redis calls.

3. **Batch Operations**: For bulk permission checks, consider using Redis pipeline operations.

4. **Key Expiration**: Consider setting TTL (Time To Live) for temporary permissions.

## Security Considerations

1. **Permission Validation**: Always validate permission strings to prevent injection attacks.

2. **Least Privilege**: Grant only the minimum permissions necessary for each user.

3. **Audit Logging**: Log all permission changes for audit purposes.

4. **Permission Inheritance**: Consider implementing role-based inheritance for complex permission structures.

## Extending the System

The ACL system can be extended to support:

1. **Role-Based Access**: Add role prefixes to keys (e.g., `a/r/admin/posts/*`).

2. **Group-Based Access**: Add group prefixes to keys (e.g., `a/g/team1/posts/*`).

3. **Time-Based Permissions**: Use Redis key expiration for temporary permissions.

4. **Resource Hierarchies**: Support nested resource types (e.g., `a/u/1111/organizations/3333/departments/*`). 