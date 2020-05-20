import zmq

class TexasClient:
    def __init__(self, request_srv, receive_srv):
        self.request_srv = request_srv
        self.receive_srv = receive_srv
        context = zmq.Context()
        self.send_socket = context.socket(zmq.PUSH)
        self.send_socket.bind(request_srv)

        self.receive_socket = context.socket(zmq.PULL)
        self.receive_socket.bind(receive_srv)


    def send(self, request):
        self.send_socket.send_json(request)

    def receive(self):
        result = self.receive_socket.recv_json()
        return result