import { z } from "zod";

const stringSchema = z.string();
const numberSchema = z.number();
const dateSchema = z.date();
const stringArr = z.array(z.string());
const intArr = z.array(z.number());

export function isStringInteger(testSubject: unknown): number {
    const stringInput = stringSchema.parse(testSubject);
    const toNumber = parseInt(stringInput, 10);
    return numberSchema.parse(toNumber);
}

export function isInteger(testSubject: unknown): number {
    return numberSchema.parse(testSubject);
}

export function isString(testSubject: unknown): string {
    return stringSchema.parse(testSubject);
}

export function arrayIsAllStrings(testSubject: unknown[]): string[] {
    return stringArr.parse(testSubject);
}

export function arrayIsAllInteger(testSubject: unknown[]): number[] {
    return intArr.parse(testSubject);
}

export function isDate(testSubject: unknown): Date {
    return dateSchema.parse(testSubject);
}
