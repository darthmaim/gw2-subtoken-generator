import { ObjectMap } from "./types";

export function arrayToBoolMap<T extends string[]>(array: T): ObjectMap<boolean> {
    return array.reduce((all, entry) => ({ ...all, [entry]: false}), {});
}
