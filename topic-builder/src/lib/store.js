import {
    createStore,
    compose,
    applyMiddleware,
    bindActionCreators
} from "redux";
import rootReducer from "./reducers/index";
import { connect } from "react-redux";
import Dexie from "dexie";
import { get, camelCase } from "lodash";
import actions from "./reducers/actions";
import { isFunction } from "util";
import {
    selectFilter,
    selectHighlight,
    hasFilters,
    getKeywordsUsed,
    keys as filterKeys
} from "./reducers/filter";
import { serverStore, LABEL_SET, LOGS_COLLECTION } from "./queries";

//#region Set Logger
let logData = [];
let session;

export const setSession = newInfo => {
    session = { ...session, ...newInfo };
    sessionStorage.setItem("ela-session", JSON.stringify(session));
};

export const resetSession = () => {
    setSession({
        start: Date.now()
    });
};

export const getSession = () => {
    if (!session) {
        let savedSession = sessionStorage.getItem("ela-session");
        if (savedSession) {
            savedSession = JSON.parse(savedSession);
        }
        if (!savedSession) {
            savedSession = {
                start: Date.now()
            };
        }
        session = savedSession;
        setSession(session);
    }
    return session;
};

const aliases = {
    LABELS_SET_SELECTION: {
        Name: "Selected Label",
        Group: "Filter",
        getLabel: (state, action) => {
            return state.labelSet.Labels.find(d => d.ID === action.IDs);
        }
    },
    ADD_LABEL: {
        Name: "Added Label",
        Group: "Editing",
        getLabel: (state, action) => {
            return state.labelSet.Labels[0];
        }
    },
    SET_CONTEXT: {
        Name: "Start System",
        Group: "Admin"
    },
    PROJECTION_SET_SELECTION: {
        Name: "Projection Selection",
        Group: "Filter"
    },
    SET_SELECTED_SUGGESTION: {
        Name: "Inspect Suggestion",
        Group: "Filter"
    },
    UPDATE_SELECTED_SUGGESTION: {
        Name: "Update Selected Suggestion",
        Group: "Filter"
    },
    REMOVE_LABEL_SET_LABEL: {
        Name: "Remove Label",
        Group: "Editing",
        getLabel: (state, action, prevState) => {
            return prevState.labelSet.Labels.find(d => d.ID === action.ID);
        }
    },
    ADD_LABEL_SET_RULE: {
        Name: "Add Rule",
        Group: "Editing",
        getLabel: (state, action, prevState) => {
            return state.labelSet.Labels.find(d => d.ID === action.ID);
        }
    },
    UPDATE_LABEL_SET_RULE: {
        Name: "Update Rule",
        Group: "Editing",
        getLabel: (state, action, prevState) => {
            return state.labelSet.Labels.find(d => d.ID === action.ID);
        }
    },
    REMOVE_LABEL_SET_RULE: {
        Name: "Remove Rule",
        Group: "Editing",
        getLabel: (state, action, prevState) => {
            return state.labelSet.Labels.find(d => d.ID === action.ID);
        }
    }
};

const logger = store => next => action => {
    let session = getSession();
    let prevState = store.getState();
    let result = next(action);
    let state = store.getState();
    let actionDetails = aliases[action.type];

    let relatedLabel =
        (actionDetails &&
            actionDetails.getLabel &&
            actionDetails.getLabel(state, action, prevState)) ||
        {};
    let actionInfo = {
        Action: actionDetails ? actionDetails.Name : action.type,
        Group: actionDetails ? actionDetails.Group : action.type,
        Source: action.source,
        UsedSubset: action.usedSubset,
        Label: relatedLabel.Name,
        LabelID: relatedLabel.ID,

        Timestamp: Date.now(),
        ElapsedTime: Date.now() - session.start,

        Dataset: get(state, ["dataset", "Name"]),
        DatasetID: get(state, ["dataset", "ID"]),
        User: sessionStorage.getItem("expl-userId"),

        // Search: "",
        // Projection: "",
        // SelectLabels: "",
        // Suggestion: "",
        // Coverage: "",
        // IndividualLabels: "",
        OtherFilters: [],

        RawAction: action,
        NewState: state
    };
    for (let key in state.filter.joinMethod) {
        for (let selection of state.filter.joinMethod[key]) {
            if (filterKeys.indexOf(selection) > -1) {
                actionInfo[selection] = key;
            }
        }
    }

    logData.push(actionInfo);

    return result;
};

const storeEnhancers = [applyMiddleware(logger)];
//#endregion

//#region Build Store
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

let store = createStore(rootReducer, {}, compose(...storeEnhancers));

if (module.hot) {
    module.hot.accept("./reducers/index.js", reducer => {
        store.replaceReducer(reducer);
    });
}
//#endregion

//#region Build Dataset
export var db = new Dexie("ExplLabeling");
db.version(1).stores({
    labelSets: "++ID,[ID+datasetID]"
});

db.open().catch(function(error) {
    alert("Uh oh : " + error);
});
//#endregion

//#region Subscribe
store.subscribe(() => {});
//#endregion

//#region Helpers
window.store = store;
export const s = {
    textField: "textField: dataset.textField.ID",
    datasetID: "dataset.ID",
    filter: (ID, params = {}) => {
        return state => {
            return {
                [params.alias || "filter"]: selectFilter(state, ID, params)
            };
        };
    },
    labels: "labels:labelSet.Labels",
    datasetSize: "dataset.Info.Size",
    highlight: selectHighlight,
    hasFilters: (params = {}) => {
        return state => {
            return { [params.alias || "hasFilter"]: hasFilters(state, params) };
        };
    },
    keywordsUsed: state =>
        getKeywordsUsed(
            get(state, "filter"),
            get(state, ["labelSet", "Labels"])
        )
};

export const select = (fields, selectActions) => {
    return connect(
        state => {
            let result = {};
            for (let field of fields) {
                if (isFunction(field)) {
                    let value = field(state);
                    result = { ...result, ...value };
                } else {
                    let fieldName = field.split(":").map(d => d.trim());
                    let fieldAlias = "";
                    if (fieldName.length > 1) {
                        fieldAlias = fieldName[0];
                        fieldName = fieldName[1];
                    } else {
                        fieldName = fieldName[0];
                        fieldAlias = camelCase(fieldName);
                    }
                    let fieldValue = get(state, fieldName);
                    result[fieldAlias] = fieldValue;
                }
            }
            return result;
        },
        dispatch => {
            let result = {};
            if (!selectActions) return {};
            for (let action of selectActions) {
                if (!actions[action]) {
                    console.error("Action", action, "Not Found");
                } else {
                    result[action] = actions[action];
                }
            }

            return bindActionCreators(result, dispatch);
        }
    );
};

let resizeTimer = null;
window.addEventListener("resize", () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
        store.dispatch({
            type: "SET_LAYOUT",
            layout: {
                windowHeight: window.innerHeight,
                windowWidth: window.innerWidth
            }
        });
    }, 300);
});

//#endregion

//#region Persist
let persistTimer;
export function setPersist(user, labelSet, namespace) {
    if (persistTimer) return;
    let cacheData = {};
    persistTimer = setInterval(() => {
        if (logData.length) {
            serverStore
                .addOrUpdateMany(
                    logData.map(l => ({
                        data: { ...l, user, labelSet, namespace }
                    })),
                    LOGS_COLLECTION
                )
                .then(r => {
                    logData = [];
                });
        }
        let labelSet = store.getState().labelSet;
        if (labelSet !== cacheData.labelSet) {
            cacheData.labelSet = labelSet;
            serverStore
                .update(labelSet.ID, labelSet, LABEL_SET)
                .catch(error => {
                    console.error("Error Persisting");
                    console.error(error);
                });
        }
    }, 5000);
}

//#endregion

export default store;
