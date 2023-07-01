export const validateLength = (value: string, minLength: number, maxLength?: number): string => {
    if (value.length < minLength) {
        throw Error(`Value length must be at least ${minLength}`);
    }
    if (maxLength && value.length > maxLength) {
        throw Error(`Value length must be at most ${maxLength}`);
    }
    return value;
}; // 改成库