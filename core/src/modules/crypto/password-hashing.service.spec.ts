import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHashingService } from './password-hashing.service';
import * as cryptoUtils from './crypto.utils';

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashingService],
    }).compile();

    service = module.get<PasswordHashingService>(PasswordHashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password and return a string in "salt:hash" format', async () => {
      // Mock the crypto utilities
      const mockSalt = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
      const mockHash = Buffer.from('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', 'hex');
      
      jest.spyOn(cryptoUtils, 'randomBytesAsync').mockResolvedValue(mockSalt);
      jest.spyOn(cryptoUtils, 'pbkdf2Async').mockResolvedValue(mockHash);

      const password = 'test-password';
      const result = await service.hash(password);

      // Verify format
      expect(result).toContain(':');
      
      const [salt, hash] = result.split(':');
      expect(salt).toEqual(mockSalt.toString('hex'));
      expect(hash).toEqual(mockHash.toString('hex'));
      
      // Verify crypto functions were called with correct params
      expect(cryptoUtils.randomBytesAsync).toHaveBeenCalledWith(16);
      expect(cryptoUtils.pbkdf2Async).toHaveBeenCalledWith(
        password,
        mockSalt.toString('hex'),
        service['iterations'],
        service['keylen'],
        service['digest']
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', async () => {
      const password = 'test-password';
      const salt = '0123456789abcdef0123456789abcdef';
      const expectedHash = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6';
      const hashedPassword = `${salt}:${expectedHash}`;

      // Mock pbkdf2Async to return the expected hash
      jest.spyOn(cryptoUtils, 'pbkdf2Async').mockResolvedValue(
        Buffer.from(expectedHash, 'hex')
      );

      const result = await service.validate(password, hashedPassword);
      
      expect(result).toBe(true);
      expect(cryptoUtils.pbkdf2Async).toHaveBeenCalledWith(
        password,
        salt,
        service['iterations'],
        service['keylen'],
        service['digest']
      );
    });

    it('should return false for an invalid password', async () => {
      const password = 'wrong-password';
      const salt = '0123456789abcdef0123456789abcdef';
      const storedHash = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6';
      const calculatedHash = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1';
      const hashedPassword = `${salt}:${storedHash}`;

      // Mock pbkdf2Async to return a different hash than the stored one
      jest.spyOn(cryptoUtils, 'pbkdf2Async').mockResolvedValue(
        Buffer.from(calculatedHash, 'hex')
      );

      const result = await service.validate(password, hashedPassword);
      
      expect(result).toBe(false);
    });
  });

  describe('integration', () => {
    it('should validate a password that was hashed using the service', async () => {
      // Restore the original implementations for this test
      jest.restoreAllMocks();
      
      const password = 'test-password';
      
      // Hash the password
      const hashedPassword = await service.hash(password);
      
      // Validate the password
      const isValid = await service.validate(password, hashedPassword);
      expect(isValid).toBe(true);
      
      // Validate an incorrect password
      const isInvalid = await service.validate('wrong-password', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });
}); 