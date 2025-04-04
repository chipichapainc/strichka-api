import { CryptoService } from "./crypto.service";

describe('CryptoService', () => {
    let cryptoService: CryptoService;

    beforeEach(() => {
        cryptoService = new CryptoService();
    });

    describe('encryption', () => {
        it('.encrypt() should return a string', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await cryptoService.encrypt(secret, data);
            expect(typeof encrypted).toEqual('string');
        });
        it('decrypted data should match original data', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await cryptoService.encrypt(secret, data);
            expect(await cryptoService.decrypt(secret, encrypted)).toEqual(data)
        });
        it('.decrypt() should fail on invalid secret', async () => {
            const data = { foo: "bar" };
            const secret = "password"
            const encrypted = await cryptoService.encrypt(secret, data);
            let decrypted;
            try {
                decrypted = await cryptoService.decrypt("different_password", encrypted)
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
                decrypted = await cryptoService.decrypt(secret, encrypted)
            } catch (e) {
                expect(e).toBeDefined();
            }
        });
    });
});