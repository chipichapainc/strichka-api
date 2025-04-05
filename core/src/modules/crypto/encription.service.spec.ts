import { EncryptionService } from "./encryption.service";

describe('EncryptionService', () => {
    let encryptionService: EncryptionService;

    beforeEach(() => {
        encryptionService = new EncryptionService();
    });

    describe('encryption', () => {
        it('.encrypt() should return a string', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await encryptionService.encrypt(secret, data);
            expect(typeof encrypted).toEqual('string');
        });
        it('decrypted data should match original data', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await encryptionService.encrypt(secret, data);
            expect(await encryptionService.decrypt(secret, encrypted)).toEqual(data)
        });
        it('.decrypt() should fail on invalid secret', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await encryptionService.encrypt(secret, data);
            let decrypted;
            try {
                decrypted = await encryptionService.decrypt("different_password", encrypted)
            } catch (e) {
                expect(e).toBeDefined();
            }
            expect(decrypted).not.toEqual(data);
        });
        it('.decrypt() should fail on invalid encrypted data', async () => {
            const encrypted = "<<invalid data>>";
            const secret = "password"
            let decrypted;
            try {
                decrypted = await encryptionService.decrypt(secret, encrypted)
            } catch (e) {
                expect(e).toBeDefined();
            }
        });
    });
});