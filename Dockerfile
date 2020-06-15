
FROM node:10

# Install All required python files and set path
RUN curl -Ok https://repo.anaconda.com/miniconda/Miniconda3-py37_4.8.2-Linux-x86_64.sh
RUN bash Miniconda3-py37_4.8.2-Linux-x86_64.sh -b -p
RUN rm Miniconda3-py37_4.8.2-Linux-x86_64.sh

ENV PATH "/root/miniconda3/bin:$PATH"

RUN conda update conda
RUN conda install -c conda-forge gensim==3.7.1
RUN conda install -c conda-forge umap-learn==0.3.10
RUN conda install -c conda-forge smart_open==1.9.0
RUN conda install pandas==0.23.4

COPY ./client /app/client

# # Client 
WORKDIR /app/client
RUN npm install --no-cache && npm run build

# # Ela Other Client
COPY ./topic-builder /app/topic-builder
WORKDIR /app/topic-builder
RUN npm install --no-cache && npm run build


# server
COPY ./server /app/server
WORKDIR /app/server
RUN npm install --no-cache

EXPOSE 3000

CMD ["npm","run","start"]
