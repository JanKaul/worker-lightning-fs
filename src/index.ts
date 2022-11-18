import { match } from "ts-pattern";
import { pattern, Result, variant } from "variant-ts";
import { Action, Response } from "./common";

export class FS {
    fileType(path: String): Promise<String> {
        return new Promise((resolve, reject) => {
            let worker = new Worker(new URL("./worker/worker", import.meta.url), { "type": "module" });
            worker.onmessage = <T, V>({ data }: { data: Result<T, V> }) => {
                match(data)
                    .with(pattern("ok"), res => {
                        match(res.value as Response)
                            .with(pattern("FileType"), res => { resolve(res.value) })
                            .otherwise(_ => { reject("Wrong response type.") })
                    })
                    .with(pattern("err"), res => { reject(res.value) })
                    .exhaustive()
                worker.terminate()
            };
            worker.onerror = (e) => {
                reject(e)
            };
            let action = variant<Action>("FileType", path);
            worker.postMessage(action);
            return
        })
    }
}