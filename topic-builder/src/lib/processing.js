import Worker from "./data.worker.js";

export function runTask({ action, payload }) {
    const worker = new Worker();
    worker.postMessage({ action, payload });
    return new Promise((resolve, reject) => {
        worker.addEventListener("message", function(event) {
            resolve(event.data);
        });
    });
}
