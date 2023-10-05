import {clean} from "../clean";

export const processShim = {
    platform: process.platform,
    cwd: () => __wrap_subinvoke("plugin/process", "cwd", clean(undefined)).value,
}