import { default as FS } from '@isomorphic-git/lightning-fs';
import { match } from 'ts-pattern';
import { err, ok, pattern, variant, Variant } from "variant-ts";
import { Action, Response } from "../common";



let fs = new FS("lightningFS")

let run = async (action: Action) => {
    return match(action)
        .with(pattern("FileType"), async res => {
            let stats = await fs.promises.stat(res.value);
            let file_type = stats.type
            return ok(variant<Response>("FileType", file_type))
        })
        .exhaustive()
}

self.onmessage = ({ data }: { data: Action }) => {
    run(data).then(res => { self.postMessage(res) })
};

self.onerror = (e) => {
    self.postMessage({
        result: err(e),
    });
}