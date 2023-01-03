import WebworkerPromise from "webworker-promise";

export const worker = new WebworkerPromise(new Worker(`${window.location.origin}/worker.js`));
