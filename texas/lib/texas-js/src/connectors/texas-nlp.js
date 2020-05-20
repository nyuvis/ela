const zmq = require("zeromq");
const uuidv4 = require("uuid/v4");
const EventEmitter = require("events");

class NLP {
    constructor(config) {
        this.config = config;
        this.send_sock = zmq.socket("push");
        this.send_sock.bindSync(config.send_socket);

        this.recv_sock = zmq.socket("pull");
        this.recv_sock.bindSync(config.recv_socket);

        this.notify = new EventEmitter();

        this.recv_sock.on("message", msg => {
            let result = JSON.parse(msg.toString());
            this.notify.emit(result.taskID, result);
        });
    }
    sendTask(task) {
        let taskID = uuidv4();
        task.taskID = taskID;
        this.send_sock.send(JSON.stringify(task));
        return new Promise((resolve, reject) => {
            this.notify.once(taskID, resolve);
        });
    }
}

module.exports = NLP;
