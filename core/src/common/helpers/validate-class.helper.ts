import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export const validateClass = <T extends object>(obj: object, cls: ClassConstructor<T>) => {
    const instance = plainToInstance(
        cls,
        obj,
        { 
            enableImplicitConversion: true, 
            excludeExtraneousValues: true 
        },
    );
    const errors = validateSync(
        instance,
        { skipMissingProperties: false }
    );
    return {
        success: !errors.length,
        instance,
        errors,
    }
}