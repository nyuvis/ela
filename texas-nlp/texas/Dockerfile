FROM python:3.6
WORKDIR /tmp/install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install jupyter
RUN python -m spacy download en_core_web_lg
WORKDIR /app
COPY ./api ./texas/api
COPY ./clients ./texas/clients
COPY ./datasets ./texas/datasets
COPY ./ml ./texas/ml
COPY ./processing ./texas/processing
COPY ./resources ./texas/resources
COPY ./server ./texas/server
COPY ./__init__.py ./texas/__init__.py
COPY ./store.py ./texas/store.py
COPY ./utils.py ./texas/utils.py

RUN pip install bs4
RUN pip install iso-639
RUN pip install langid
RUN pip install jupyterlab
RUN pip install pandas
RUN pip install -U turicreate
RUN pip install pyLDAvis
RUN pip install Cython
ARG LIBS
RUN pip install krovetzstemmer
RUN pip install tensorflow
RUN pip install fasttext $LIBS
RUN python -m spacy download en_core_web_sm
#RUN apt-get install -y libblas3 liblapack3 libstdc++6 python-setuptools
ENV PYTHONPATH /app
ENV TEXAS_NLP_DATA_PATH /data
ENV TXNLP_NOTEBOOKS /app/notebooks

