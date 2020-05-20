import sys
from texas.clients import get_instance
    
def get_dataset_specification(DATASET_NAME, DATA_FOLDER):
    dataset_scripts = "{data_folder}/{dataset}/scripts".format(dataset=DATASET_NAME, data_folder=DATA_FOLDER)
    if dataset_scripts not in sys.path:
        sys.path.append(dataset_scripts)

    from import_info import get_spec
    SPEC, data_dunctions = get_spec()
    return SPEC, data_dunctions



def get_client(DATASET_NAME, DATA_FOLDER="/data"):
    specification, functions = get_dataset_specification(DATASET_NAME, "/data")
    dataset_info = specification["data_destination"]
    dataset_connection = dataset_info["connection"]
    dataset = get_instance(dataset_connection["type"], dataset_connection["connection"])
    return dataset