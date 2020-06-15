import { resetSession } from "../store";
export const setDataset = dataset => ({ type: "SET_DATASET", dataset });
export const setContext = (dataset, labelSet, params) => ({
    type: "SET_CONTEXT",
    dataset,
    labelSet,
    ...params
});

export const setTextField = textField => ({
    type: "SET_TEXT_FIELD",
    textField
});

function addTextField(dataset, textField) {
    if (!dataset.textField) {
        if (textField) {
            textField = dataset.Schema.Fields.find(f => f.ID === textField);
        } else {
            textField = dataset.Schema.Fields.find(f => f.Type === "TEXT");
        }
        dataset.textField = textField;
    }
    return dataset;
}

const resetSessionIfChanged = dataset => {
    let current = sessionStorage.getItem("ela-dataset");
    if (current !== dataset.ID) {
        sessionStorage.setItem("ela-dataset", dataset.ID);
        resetSession();
    }
};

export default (state = null, action) => {
    switch (action.type) {
        case "SET_DATASET":
            state = action.dataset;
            resetSessionIfChanged(action.dataset);
            state = addTextField(state, action.textField);
            return state;
        case "SET_TEXT_FIELD":
            return { ...state, textField: action.textField };

        case "SET_CONTEXT":
            resetSessionIfChanged(action.dataset);
            return addTextField(action.dataset, action.textField);
        default:
            break;
    }
    return state;
};
