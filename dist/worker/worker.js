import { default as FS } from '@isomorphic-git/lightning-fs';
import { match } from 'ts-pattern';
import { err, ok, pattern, variant } from "variant-ts";
let fs = new FS("lightningFS");
let run = async (action) => {
    return match(action)
        .with(pattern("FileType"), async (res) => {
        let stats = await fs.promises.stat(res.value);
        let file_type = stats.type;
        return ok(variant("FileType", file_type));
    })
        .exhaustive();
};
self.onmessage = ({ data }) => {
    run(data).then(res => { self.postMessage(res); });
};
self.onerror = (e) => {
    self.postMessage({
        result: err(e),
    });
};
