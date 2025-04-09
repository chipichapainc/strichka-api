import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';
import { RedisService } from '../redis/redis.service';
import { Permission, Permissions } from './types/permission.types';
import { AccessKey, EAccessKeyType } from './access-builder/access-key';
import { AccessKeyBuilder } from './access-builder/access-key-builder';

describe('AccessService', () => {
    let service: AccessService;
    let redisService: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessService,
                {
                    provide: RedisService,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                        del: jest.fn(),
                        multi: jest.fn().mockReturnValue({
                            get: jest.fn(),
                            exec: jest.fn(),
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AccessService>(AccessService);
        redisService = module.get<RedisService>(RedisService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('grantAccess', () => {
        it('should grant access permission to a resource', async () => {
            const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);
            const permission = Permissions.READ;

            await service.grantAccess(accessKey, permission);

            expect(redisService.set).toHaveBeenCalledWith(
                accessKey.toString(),
                permission
            );
        });
    });

    describe('revokeAccess', () => {
        it('should revoke access permission from a resource', async () => {
            const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);

            await service.revokeAccess(accessKey);

            expect(redisService.del).toHaveBeenCalledWith(accessKey.toString());
        });
    });

    describe('verifyAccess', () => {
        describe('single access key', () => {
            it('should return true when permission exists and matches', async () => {
                const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);
                const permission = Permissions.READ;

                (redisService.get as jest.Mock).mockResolvedValue(permission);

                const result = await service.verifyAccess(accessKey, permission);

                expect(result).toBe(true);
                expect(redisService.get).toHaveBeenCalledWith(accessKey.toString());
            });

            it('should return false when permission does not exist', async () => {
                const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);
                const permission = Permissions.READ;

                (redisService.get as jest.Mock).mockResolvedValue(null);

                const result = await service.verifyAccess(accessKey, permission);

                expect(result).toBe(false);
            });

            it('should return true when granted permission is READ_WRITE and required is READ', async () => {
                const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);
                const grantedPermission = Permissions.READ_WRITE;
                const requiredPermission = Permissions.READ;

                (redisService.get as jest.Mock).mockResolvedValue(grantedPermission);

                const result = await service.verifyAccess(accessKey, requiredPermission);

                expect(result).toBe(true);
            });

            it('should return true when granted permission is READ_WRITE and required is WRITE', async () => {
                const accessKey = new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']);
                const grantedPermission = Permissions.READ_WRITE;
                const requiredPermission = Permissions.WRITE;

                (redisService.get as jest.Mock).mockResolvedValue(grantedPermission);

                const result = await service.verifyAccess(accessKey, requiredPermission);

                expect(result).toBe(true);
            });
        });

        describe('multiple access keys', () => {
            it('should return array of boolean results for multiple keys', async () => {
                const accessKeys = [
                    new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post1']),
                    new AccessKey(EAccessKeyType.USER, ['user1', 'posts', 'post2']),
                ];
                const permission = Permissions.READ;
                const mockResults = [permission, null];

                const mockPipeline = {
                    get: jest.fn(),
                    exec: jest.fn().mockResolvedValue(mockResults),
                };
                (redisService.multi as jest.Mock).mockReturnValue(mockPipeline);

                const result = await service.verifyAccess(accessKeys, permission);

                expect(result).toEqual([true, false]);
                expect(redisService.multi).toHaveBeenCalled();
                expect(mockPipeline.get).toHaveBeenCalledTimes(2);
            });

            it('should return empty array for empty access keys array', async () => {
                const accessKeys: AccessKey[] = [];
                const permission = Permissions.READ;

                const result = await service.verifyAccess(accessKeys, permission);

                expect(result).toEqual([]);
                expect(redisService.multi).not.toHaveBeenCalled();
            });
        });
    });

    describe('hasPermission', () => {
        it('should return true when granted permission is READ_WRITE', () => {
            const grantedPermission = Permissions.READ_WRITE;
            const requiredPermission = Permissions.READ;

            const result = service['hasPermission'](grantedPermission, requiredPermission);

            expect(result).toBe(true);
        });

        it('should return true when granted permission matches required permission', () => {
            const grantedPermission = Permissions.READ;
            const requiredPermission = Permissions.READ;

            const result = service['hasPermission'](grantedPermission, requiredPermission);

            expect(result).toBe(true);
        });

        it('should return false when granted permission does not include required permission', () => {
            const grantedPermission = Permissions.READ;
            const requiredPermission = Permissions.WRITE;

            const result = service['hasPermission'](grantedPermission, requiredPermission);

            expect(result).toBe(false);
        });
    });
}); 