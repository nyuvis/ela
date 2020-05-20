### Start Docker - Dev

```bash
docker run -it -v "$PWD":/app/texas -p 5555:5555 -p 5556:5556 texas-nlp /bin/bash
docker run -it -v "$PWD":/app/texas --env IN_SERVER=tcp://192.168.0.5:5555 --env OUT_SERVER=tcp://192.168.0.5:5556 texas-nlp python /app/texas/server/server.py
```
