import { getClient } from "./api";
import { get } from "lodash";
import gql from "graphql-tag";

export const STORE = "exploratory-labeling";
export const LABEL_SET = "LabelSets";
export const LOGS_COLLECTION = "interaction-log";

//get Data-----------------------------------------------------------------------
export const getDataQuery = gql`
    query getDataset($ID: ID, $filter: Filter, $noSpecialFilter: Filter) {
        Dataset(ID: $ID) {
            Select(filter: $filter) {
                Size
            }
            NoSpecial: Select(filter: $noSpecialFilter) {
                Size
            }
        }
    }
`;

export const projectionPanelQuery = gql`
    query projectionPanel(
        $ID: ID
        $params: JSON
        $ignoreTerms: [String]
        $field: String!
        $filter: Filter
        $filterSuggestions: Filter
        $binsY: Int = 50
        $binsX: Int = 50
        $featureX: String
        $featureY: String
    ) {
        Dataset(ID: $ID) {
            Stats: Select {
                StatsX: FieldStats(field: $field, feature: $featureX) {
                    Max
                    Min
                    Count
                }
                StatsY: FieldStats(field: $field, feature: $featureY) {
                    Max
                    Min
                    Count
                }
            }
            Histogram: Select(filter: $filter) {
                Histogram2D(
                    field: $field
                    featureX: "projection_point.x"
                    featureY: "projection_point.y"
                    binsX: $binsX
                    binsY: $binsY
                ) {
                    IdxX
                    IdxY
                    KeyX
                    KeyY
                    Count
                }
            }
            Suggestions: Select(filter: $filterSuggestions) {
                NLP {
                    TopicModel(
                        field: $field
                        method: PROJECTION
                        ignoreTerms: $ignoreTerms
                        params: $params
                    ) {
                        ID
                        Topic
                        Keywords {
                            Keyword
                        }
                    }
                }
            }
        }
    }
`;

export const getData = datasetID => {
    return getClient()
        .query({
            query: getDataQuery,
            variables: { ID: datasetID }
        })
        .then(result => result.data.Dataset);
};

//#region Get Discovery data
export const getDiscoveryDataQuery = gql`
    query getDiscoveryData($ID: ID, $field: String!) {
        Dataset(ID: $ID) {
            Select {
                NLP {
                    Projection(field: $field, method: TSNE)
                }
            }
        }
    }
`;

export const getWordSimilaritySeedsQuery = gql`
    query getDiscoveryData(
        $ID: ID
        $field: String!
        $params: JSON
        $ignore: [String]
    ) {
        Dataset(ID: $ID) {
            Select {
                NLP {
                    KeywordTopics: TopicModel(
                        field: $field
                        method: W2V_TOP_FREQ
                        min_words: 1
                        max_words: 3
                        params: $params
                        ignoreTerms: $ignore
                    ) {
                        ID
                        Topic
                        Keywords {
                            Keyword
                            Weight
                        }
                    }
                }
            }
        }
    }
`;

export const getLDASeedsQuery = gql`
    query getDiscoveryData($ID: ID, $field: String!, $ignore: [String]) {
        Dataset(ID: $ID) {
            Select {
                NLP {
                    KeywordTopics: TopicModel(
                        field: $field
                        method: LDA
                        ignoreTerms: $ignore
                    ) {
                        ID
                        Topic
                        Keywords {
                            Keyword
                            Weight
                        }
                    }
                }
            }
        }
    }
`;

//#endregion

//#region
export const getDocumentQuery = gql`
    query getDocument(
        $ID: ID
        $docID: ID
        $docIDStr: [String]
        $textField: String
        $highlight: [String]
    ) {
        Dataset(ID: $ID) {
            Document(ID: $docID) {
                ID
                Raw
            }
            Select(ids: [$docID]) {
                Documents {
                    ID
                    Score
                    Text: Highlight(
                        ID: $textField
                        highlight: $highlight
                        numFragments: 0
                    )
                }
            }
            Similar: Select(
                filter: { field: $textField, likeThis: $docIDStr }
            ) {
                Documents(size: 10) {
                    ID
                    Text: Highlight(ID: $textField, highlight: $highlight)
                }
            }
        }
    }
`;
//#endregion

//#region
export const getInfoDataquery = gql`
    query getInfoData(
        $ID: ID
        $filter: Filter
        $filterDocuments: Filter
        $field: String
        $showField: String
        $exclude: [String]
        $highlight: [String]
        $sortBy: SortByOrder
        $from: Int
        $discriminant: Boolean
    ) {
        Dataset(ID: $ID) {
            Select(filter: $filter) {
                Size
                Values(
                    field: $field
                    discriminant: $discriminant
                    size: 20
                    exclude: $exclude
                ) {
                    Key
                    KeyAsString
                    Stat
                }
            }
            Documents: Select(filter: $filterDocuments) {
                Documents(size: 100, sortBy: { Order: $sortBy }, from: $from) {
                    ID
                    Text: Highlight(ID: $showField, highlight: $highlight)
                    Score
                }
            }
        }
    }
`;
//#endregion

//getDataset ---------------------------------------------------------------------
export const getDatasetQuery = gql`
    query getDataset($ID: ID) {
        Dataset(ID: $ID) {
            ID
            Name
            Schema {
                Fields {
                    ID
                    Name
                    Type
                }
            }
            Info: Select {
                Size
            }
        }
    }
`;

export const getDataset = datasetID => {
    return getClient()
        .query({
            query: getDatasetQuery,
            variables: { ID: datasetID }
        })
        .then(result => result.data.Dataset);
};

//getLabelSet ---------------------------------------------------------------------

export const getLabelSetQuery = gql`
    query getLabelSet(
        $storeId: String
        $collection: String
        $labelSet: [String]
    ) {
        Store(ID: $storeId) {
            Collection(ID: $collection) {
                Select(filter: { field: "labelSetID", query: $labelSet }) {
                    Documents {
                        ID
                        Raw
                    }
                }
            }
        }
    }
`;

export const getLabelSets = labelSet => {
    return getClient()
        .query({
            query: getLabelSetQuery,
            variables: {
                storeId: STORE,
                collection: LABEL_SET,
                labelSet: labelSet || "*"
            }
        })
        .then(result =>
            (
                get(result, [
                    "data",
                    "Store",
                    "Collection",
                    "Select",
                    "Documents"
                ]) || []
            ).map(r => r)
        );
};

//Labelstats ---------------------------------------------------------------------

export const getFilterCounts = gql`
    query getFilterCounts(
        $ID: ID
        $filter: Filter
        $splitFilters: [SplitFilter]
        $adjFilters: [AdjMatrixFilter]
    ) {
        Dataset(ID: $ID) {
            Global: Select {
                Split(filters: $splitFilters) {
                    Key
                    Size
                }
                AdjMatrix(labelFilters: $adjFilters) {
                    Nodes {
                        Key
                        Count
                    }
                    Links {
                        Key
                        Count
                    }
                }
            }
            Local: Select(filter: $filter) {
                Split(filters: $splitFilters) {
                    Key
                    Size
                }
                AdjMatrix(labelFilters: $adjFilters) {
                    Nodes {
                        Key
                        Count
                    }
                    Links {
                        Key
                        Count
                    }
                }
            }
        }
    }
`;

export const labelSetStatusQuery = gql`
    query getlabelStats(
        $ID: ID
        $filter: Filter
        $labelFilters: [SplitFilter]
    ) {
        Dataset(ID: $ID) {
            Select(filter: $filter) {
                LabelsStats: Split(filters: $labelFilters) {
                    Key
                    Size
                }
            }
        }
    }
`;

export const filtersMatrix = gql`
    query getFiltersMatrix($ID: ID, $filters: [AdjMatrixFilter]) {
        Dataset(ID: $ID) {
            Select {
                AdjMatrix(labelFilters: $filters) {
                    Nodes {
                        Key
                        Count
                    }
                    Links {
                        Key
                        Count
                    }
                }
            }
        }
    }
`;

//setLabelSet ---------------------------------------------------------------------
export const setLabelSetQuery = gql`
    mutation setLabelSet(
        $store: String
        $collection: ID
        $document: JSON
        $docID: ID
    ) {
        Store(ID: $store) {
            Collection(ID: $collection) {
                Document: addOrUpdate(document: $document, ID: $docID) {
                    ID
                    Raw
                }
            }
        }
    }
`;

export const setLabelSet = (labelSet, ID) => {
    return getClient()
        .mutate({
            mutation: setLabelSetQuery,
            variables: {
                store: STORE,
                collection: LABEL_SET,
                docID: ID,
                document: labelSet
            }
        })
        .then(result =>
            get(result, ["data", "Store", "Collection", "Document"])
        );
};

const addOrUpdateManyStore = gql`
    mutation set(
        $documents: [StoreDocumentInput]
        $store: String
        $collection: ID
    ) {
        Store(ID: $store) {
            Collection(ID: $collection) {
                addOrUpdateMany(documents: $documents)
            }
        }
    }
`;

export const serverStore = {
    add: documents => {},
    update: (id, data, colection) => {
        return getClient()
            .mutate({
                mutation: setLabelSetQuery,
                variables: {
                    store: STORE,
                    collection: colection,
                    docID: id,
                    document: data
                }
            })
            .then(result =>
                get(result, ["data", "Store", "Collection", "Document"])
            );
    },
    addOrUpdateMany: (documents, collection) => {
        return getClient().mutate({
            mutation: addOrUpdateManyStore,
            variables: {
                store: STORE,
                collection: collection,
                documents: documents
            }
        });
    }
};

export const getKeywordsByFiltersQuery = gql`
    query getKeywordsByFilters(
        $ID: ID
        $splitFilters: [SplitFilter]
        $field: String
    ) {
        Dataset(ID: $ID) {
            Select {
                Split(filters: $splitFilters) {
                    Key
                    Values(field: $field) {
                        Key
                        Stat
                    }
                }
            }
        }
    }
`;

export const getKeywordsByFilters = variables => {
    return getClient().query({
        query: getKeywordsByFiltersQuery,
        variables: variables
    });
};

export const getLabelsMatrixQuery = gql`
    query getKeywordsByFilters(
        $ID: ID
        $matrixFilters: [AdjMatrixFilter]
        $field: String
    ) {
        Dataset(ID: $ID) {
            Select {
                AdjMatrix(field: $field, labelFilters: $matrixFilters) {
                    Nodes {
                        Key
                        Count
                    }
                    Links {
                        Key
                        Count
                    }
                }
            }
        }
    }
`;
