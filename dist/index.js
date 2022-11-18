import { match } from "ts-pattern";
import { pattern, variant } from "variant-ts";
export class FS {
    fileType(path) {
        return new Promise((resolve, reject) => {
            let worker = new Worker(new URL("./worker/worker", import.meta.url), { "type": "module" });
            worker.onmessage = ({ data }) => {
                match(data)
                    .with(pattern("ok"), res => {
                    match(res.value)
                        .with(pattern("FileType"), res => { resolve(res.value); })
                        .otherwise(_ => { reject("Wrong response type."); });
                })
                    .with(pattern("err"), res => { reject(res.value); })
                    .exhaustive();
                worker.terminate();
            };
            worker.onerror = (e) => {
                reject(e);
            };
            let action = variant("FileType", path);
            worker.postMessage(action);
            return;
        });
    }
}
