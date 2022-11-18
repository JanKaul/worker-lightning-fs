import { Variant } from "variant-ts";
export type Action = Variant<"FileType", string>;
export type Response = Variant<"FileType", string>;
