from texas.ml.entities.ner import add_model_entity
from texas.ml.entities.regex import add_regex_entity
from texas.ml.entities.pos import add_pos_entity

ENTITY_EXTRACTORS = {
    "Regex": add_regex_entity,
    "NER": add_model_entity,
    "POS": add_pos_entity
}


def extract_entitity(dataset, entity_info, fields):
    for field in fields:
        dataset = ENTITY_EXTRACTORS[entity_info["TYPE"]](
            dataset, field, **entity_info)
    return dataset


def extract_entities(dataset, entities, fields):
    for ent in entities:
        dataset = extract_entitity(dataset, ent, fields)
    return dataset
