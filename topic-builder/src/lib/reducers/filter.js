import {
    get,
    set,
    isArray,
    isPlainObject,
    difference,
    memoize,
    flattenDeep
} from "lodash";
import { removeIdx, toggleItem, removeItem, addItemIfNot } from "../utils";

//#region
export const searchAddKeyword = (keyword, source) => ({
    type: "SEARCH_ADD_KEYWORD",
    keyword,
    source
});

export const searchSetKeyword = (keyword, source) => ({
    type: "SEARCH_SET_KEYWORD",
    keyword,
    source
});

export const setSelectedSuggestion = (
    suggestion,
    removeIfSelected = true,
    source
) => ({
    type: "SET_SELECTED_SUGGESTION",
    suggestion,
    removeIfSelected,
    source
});

export const updateSelectedSuggestion = (
    suggestion,
    removeIfSelected = true,
    source
) => ({
    type: "UPDATE_SELECTED_SUGGESTION",
    suggestion,
    removeIfSelected,
    source
});

export const searchRemoveKeyword = (keyword, source) => ({
    type: "SEARCH_REMOVE_KEYWORD",
    keyword,
    source
});

export const projectionSetSelection = (selection, source) => ({
    type: "PROJECTION_SET_SELECTION",
    selection,
    source
});

export const labelsSetSelection = (IDs, selected, replace, source) => ({
    type: "LABELS_SET_SELECTION",
    IDs,
    selected,
    replace,
    source
});

export const allActions = new Set([
    "SEARCH_ADD_KEYWORD",
    "SEARCH_SET_KEYWORD",
    "SEARCH_REMOVE_KEYWORD",
    "PROJECTION_SET_SELECTION",
    "LABELS_SET_SELECTION"
]);

export const setJoinMethod = joinMethod => ({
    type: "SET_JOIN_METHOD",
    joinMethod
});

export const setFilter = filter => ({
    type: "SET_FILTER",
    filter
});

export const addLabelIDToJoinMethod = (method, labelID) => ({
    type: "ADD_LABEL_ID_TO_JOIN_METHOD",
    method,
    labelID
});
//#endregion

const initState = {
    search: [],
    joinMethod: { ALL: [], ANY: [], NOT: [] }
};

function findItem(state, value) {
    for (let key in state) {
        let idx = (state[key] || []).indexOf(value);
        if (idx >= 0) {
            return { key, idx };
        }
    }
    return null;
}

export const keys = [
    "filter",
    "search",
    "selectedLabels",
    "projection",
    "selectedSuggestion"
];
function setJoinMethodState(state, { reverse } = {}) {
    if (reverse) {
        let result = flattenDeep(
            Object.keys(state.joinMethod).map(key =>
                state.joinMethod[key].filter(f => f.length === 36)
            )
        );
        const { selectedLabels = [] } = state;
        let diff = difference(result, selectedLabels);

        if (diff.length > 0) {
            state = {
                ...state,
                selectedLabels: [...selectedLabels, ...diff]
            };
        }
        return state;
    } else {
        let joinMethod = { ...state.joinMethod };

        for (let key of keys) {
            let hasHere =
                state[key] &&
                (state[key].length > 0 ||
                    Object.keys(state[key] || {}).length > 0);
            let hasThere = findItem(state.joinMethod, key);

            if (key === "selectedLabels") {
                let hasThereLabel = findItem(state.joinMethod, "anyLabel");
                if (hasThereLabel) {
                    joinMethod[hasThereLabel.key] = removeIdx(
                        joinMethod[hasThereLabel.key],
                        hasThereLabel.idx
                    );
                }
            }

            if (hasHere && !hasThere) {
                joinMethod.ALL = [...joinMethod.ALL, key];
            } else if (!hasHere && hasThere) {
                joinMethod[hasThere.key] = removeIdx(
                    joinMethod[hasThere.key],
                    hasThere.idx
                );
            }
        }
        let possibleValues = [
            ...keys,
            "anyLabel",
            ...(state.selectedLabels || [])
        ];
        for (let key in joinMethod) {
            let remove = difference(joinMethod[key], possibleValues);
            joinMethod[key] = difference(joinMethod[key], remove);
        }

        return { ...state, joinMethod };
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case "SEARCH_ADD_KEYWORD": {
            let search = state.search || [];
            let newSearch = [...search, action.keyword];
            let newState = setJoinMethodState({ ...state, search: newSearch });
            return newState;
        }
        case "SEARCH_SET_KEYWORD": {
            let newState = { ...state, search: [action.keyword] };
            return setJoinMethodState(newState);
        }
        case "SEARCH_REMOVE_KEYWORD": {
            let search = state.search;
            let newSearch = removeIdx(search, action.keyword);
            state = { ...state, search: newSearch };
            return setJoinMethodState({ ...state, search: newSearch });
        }

        case "UPDATE_SELECTED_SUGGESTION":
        case "PROJECTION_SET_SELECTION": {
            let newState = { ...state, projection: action.selection };
            return setJoinMethodState(newState);
        }
        case "SET_JOIN_METHOD": {
            let newState = { ...state, joinMethod: action.joinMethod };
            return setJoinMethodState(newState, { reverse: true });
        }

        case "ADD_LABEL_ID_TO_JOIN_METHOD": {
            let current = state.join[action.method];
            current = [...current, action.labelID];
            return {
                ...state,
                joinMethod: { ...state.joinMethod, [action.method]: current }
            };
        }
        case "REMOVE_LABEL_SET_LABEL": {
            let selected = removeItem(
                state.selectedLabels,
                i => i === action.ID
            );
            let newState = { ...state, selectedLabels: selected };
            return setJoinMethodState(newState);
        }
        case "LABELS_SET_SELECTION": {
            if (action.replace) {
                let newState = { ...state, selectedLabels: action.selection };
                return setJoinMethodState(newState);
            } else {
                let selected = state.selectedLabels || [];
                if (action.replace) {
                    return { ...state, selectedLabels: [...action.IDs] };
                }
                selected = [...selected];
                let IDs = action.IDs;
                if (!isArray(IDs)) IDs = [IDs];
                if (action.selected === undefined) {
                    for (let id of IDs) {
                        selected = toggleItem(selected, id);
                    }
                } else if (action.selected === false) {
                    for (let id of IDs) {
                        selected = removeItem(selected, i => i === id);
                    }
                } else if (action.selected) {
                    for (let id of IDs) {
                        selected = addItemIfNot(selected, i => i === id);
                    }
                } else {
                    console.error("None");
                }
                let newState = { ...state, selectedLabels: selected };
                return setJoinMethodState(newState);
            }
        }
        case "SET_FILTER": {
            if (!action.filter) {
                return initState;
            }

            return { ...action.filter };
        }

        case "ADD_LABEL": {
            return setJoinMethodState({
                ...state,
                selectedSuggestion: undefined
            });
        }
        case "SET_SELECTED_SUGGESTION": {
            let selection = action.suggestion;
            if (state.selectedSuggestion && action.removeIfSelected) {
                if (
                    action.suggestion &&
                    action.suggestion.Topic === state.selectedSuggestion.Topic
                ) {
                    selection = undefined;
                }
            }

            return setJoinMethodState({
                ...state,
                selectedSuggestion: selection
            });
        }
        default:
            break;
    }
    return state;
};

const ignoreKeywords = new Set(["AND", "OR", "NOT"]);
export const ruleKeywords = (rule = "") => {
    return rule
        .split(" ")
        .filter(w => !ignoreKeywords.has(w))
        .map(r => r.replace(/~[0-9]+|"/g, ""));
};

export const getKeywordsUsed = memoize((filter, labels = []) => {
    let search = get(filter, ["search"]) || [];

    let selectedLabelsRules = flattenDeep(
        labels.map(l => l.Rules.map(r => ruleKeywords(r.rule)))
    );
    search = flattenDeep(search.map(ruleKeywords));

    return { keywordsUsed: [...search, ...selectedLabelsRules] };
});

export const selectHighlight = state => {
    let search = get(state, ["filter", "search"]) || [];
    search = isArray(search) ? search : [search];
    let selectedLabels = get(state, ["filter", "selectedLabels"]) || [];

    let labels = get(state, ["labelSet", "Labels"]) || [];
    selectedLabels = selectedLabels.map(s => labels.find(d => d.ID === s));

    let selectedLabelsRules = selectedLabels
        .map(l => l.Rules.map(r => `(${r.rule})`).join(" "))
        .join(" ");
    return { highlight: [...search, selectedLabelsRules] };
};

export const ruleToString = rule => {
    return rule.rule;
};

export const compileRule = (rule, { mode = "SIMPLE", textField }) => {
    switch (mode) {
        case "SIMPLE":
            return { field: textField, query: rule.rule };

        default:
            break;
    }
};

export const compileLabelFilter = (label, { textField, mode = "SIMPLE" }) => {
    switch (mode) {
        case "SIMPLE": {
            let positiveRules = label.Rules.filter(r => r.type === "POSITIVE");
            let negativeRules = label.Rules.filter(r => r.type === "NEGATIVE");
            let filter = { and: [] };
            if (positiveRules.length > 0) {
                filter.and.push({
                    or: positiveRules.map(r =>
                        compileRule(r, { textField, mode })
                    )
                });
            }
            if (negativeRules.length > 0) {
                filter.and.push({
                    not: {
                        or: negativeRules.map(r =>
                            compileRule(r, { textField, mode })
                        )
                    }
                });
            }
            return filter;
        }

        case "RULE_LIST":
            return {
                field: textField,
                ruleList: {
                    rules: label.Rules.map(r => {
                        let rule = { rule: r.rule };
                        switch (r.type) {
                            case "POSITIVE":
                                rule.if = true;
                                rule.then = true;
                                break;
                            case "NEGATIVE":
                                rule.if = true;
                                rule.then = false;
                                break;
                            default:
                                break;
                        }
                        return rule;
                    })
                }
            };
        default:
            break;
    }
};

//#Fix Coverage
const compileComponent = (component, state, join) => {
    let field = state.dataset.textField.ID;
    let filters = state.filter;
    let value = filters[component];
    if (component === "anyLabel") {
        value = state.labelSet.Labels;
    }
    if (component === "labelsNoSpecial") {
        let labels = get(state, "labelSet.Labels") || [];
        value = labels.filter(l => !l.TYPE);
    }
    if (component.length === 36) {
        let labels = get(state, "labelSet.Labels") || [];
        value = labels.find(l => l.ID === component);
    }

    if (!value || value.length === 0) return null;

    switch (component) {
        case "search": {
            return {
                field: field,
                query: value
            };
        }
        case "projection": {
            return value;
        }
        case "labelsNoSpecial": {
            let rules = value.map(v =>
                compileLabelFilter(v, { textField: field })
            );
            if (rules && rules.length > 0) {
                return { or: rules };
            }
            return null;
        }
        case "anyLabel": {
            let rules = value.map(v =>
                compileLabelFilter(v, { textField: field })
            );
            if (rules && rules.length > 0) {
                return { or: rules };
            }
            return null;
        }
        case "selectedLabels": {
            let ids = new Set(getIDs(join));

            let labels = value
                .filter(v => !ids.has(v))
                .map(v => state.labelSet.Labels.find(l => l.ID === v));
            let rules = labels.map(v =>
                compileLabelFilter(v, { textField: field })
            );
            return { or: rules };
        }
        case "selectedSuggestion": {
            return {
                field,
                query: value.Keywords.map(k => k.Keyword).join(" ")
            };
        }
        default:
            if (component.length === 36) {
                return compileLabelFilter(value, { textField: field });
            } else {
                console.error("Unknow", component);
            }
            break;
    }
};

let filterCache = {};
let filterResult = {};

function getIDs(join) {
    let result = [];

    for (let key in join) {
        result = [...result, ...join[key].filter(d => d.length === 36)];
    }

    return result;
}

export const hasFilters = (state, { ignore = [] } = {}) => {
    if (!state.filter) return false;

    for (let component of keys.filter(c => !ignore.indexOf(c) > -1)) {
        if (
            state.filter[component] &&
            (state.filter[component].length > 0 ||
                Object.keys(state.filter[component]).length > 0)
        )
            return true;
    }
    return false;
};

const filterKeywords = new Set(["or", "not", "and"]);
export const isFilterEmpty = filter => {
    if (!filter) {
        return true;
    }
    if (isArray(filter)) {
        if (filter.length > 0) {
            return true;
        }
    } else if (isPlainObject(filter)) {
        let keys = Object.keys(filter);
        let result = true;
        for (let k of keys) {
            if (filterKeywords.has(k)) {
                result = isFilterEmpty(filter[k]);
            } else {
                return false;
            }
        }
        return result;
    }
    return true;
};

export const selectFilter = (
    state,
    ID,
    { components, labels, alias = "filter", join, ignore = [] }
) => {
    let didComponentsChange = true;
    let cache = get(filterCache, ID, "_filter_");
    let filter = state.filter;
    join = join || filter.joinMethod;

    if (cache && filter === cache) {
        return get(filterResult, ID, alias);
    }
    if (components && components.length) {
    }

    if (didComponentsChange) {
        let compiledFilter = { and: [] };

        let filterAnd = join.ALL.filter(c => ignore.indexOf(c) === -1)
            .map(c => compileComponent(c, state, join))
            .filter(f => f);

        if (filterAnd.length > 0)
            compiledFilter.and = [...compiledFilter.and, ...filterAnd];

        let filterOR = join.ANY.filter(c => ignore.indexOf(c) === -1)
            .map(c => compileComponent(c, state, join))
            .filter(f => f);
        if (filterOR.length > 0)
            compiledFilter.and = [...compiledFilter.and, { or: filterOR }];

        let filterNOT = join.NOT.filter(c => ignore.indexOf(c) === -1)
            .map(c => compileComponent(c, state, join))
            .filter(f => f);
        if (filterNOT.length > 0)
            compiledFilter.and = [
                ...compiledFilter.and,
                { not: { or: filterNOT } }
            ];

        let filterValue = compiledFilter.and.length > 0 ? compiledFilter : null;

        function setCache(value) {
            set(filterResult, [ID, alias], filterValue && value);
        }
        setCache(filterValue);
    }
    let result = get(filterResult, [ID, alias]);
    return result;
};
