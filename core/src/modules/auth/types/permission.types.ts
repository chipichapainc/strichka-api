/**
 * Represents the types of permissions that can be granted
 */
export type Permission = 'r' | 'w' | 'rw';

/**
 * Permission constants for easy reference
 */
export const Permissions = {
    READ: 'r' as Permission,
    WRITE: 'w' as Permission,
    READ_WRITE: 'rw' as Permission,
}; 