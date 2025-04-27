import { randomUUID } from "crypto";

export const generateUniqueId = (prefix: string = "user") => {
	return `BkBc-${prefix}-${randomUUID().slice(10)}`;
};


export const generateUniqueTrsasactionId = (prefix: string = "transaction") => {
	return `BkBc-${prefix}-${randomUUID().slice(10)}`;
};