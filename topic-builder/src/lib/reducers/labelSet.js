import { isArray } from "lodash";
import { guid, updateItem, removeItem } from "../utils";

export const addLabel = (name, Rules, source, more = {}) => ({
    type: "ADD_LABEL",
    name,
    Rules,
    source,
    ...more
});
export const removeLabelSetLabel = (ID, source) => ({
    type: "REMOVE_LABEL_SET_LABEL",
    ID,
    source
});
export const setLabelSet = labelSet => ({ type: "SET_LABEL_SET", labelSet });

export const setLabelSetName = (ID, name, source) => ({
    type: "SET_LABEL_SET_NAME",
    name,
    ID,
    source
});

export const setLabelSetExpanded = (ID, expanded, source) => ({
    type: "SET_LABEL_SET_EXPANDED",
    expanded,
    ID,
    source
});

export const addLabelSetRule = (ID, rule, source) => ({
    type: "ADD_LABEL_SET_RULE",
    rule,
    ID,
    source
});

export const removeLabelSetRule = (ID, rule, source) => ({
    type: "REMOVE_LABEL_SET_RULE",
    rule,
    ID,
    source
});

export const updateLabelSetRule = (ID, rule, changes, source) => ({
    type: "UPDATE_LABEL_SET_RULE",
    changes,
    rule: { rule },
    ID,
    source
});

export const addToSpecialLabel = (TYPE, Rules, source) => ({
    type: "ADD_TO_SPECIAL_LABEL",
    TYPE,
    Rules,
    source
});

//----------------------------------------------------------------------------------------------------
export default (state = null, action) => {
    switch (action.type) {
        case "SET_CONTEXT":
        case "SET_LABEL_SET":
            if (!action.labelSet.Type) {
                action.labelSet.Type = "RuleList";
            }
            return action.labelSet;
        case "SET_LABEL_SET_NAME": {
            let Labels = updateItem(
                state.Labels,
                item => item.ID === action.ID,
                item => ({ ...item, Name: action.name })
            );
            return { ...state, Labels };
        }

        case "SET_LABEL_SET_EXPANDED": {
            let Labels = updateItem(
                state.Labels,
                item => item.ID === action.ID,
                item => ({ ...item, expanded: action.expanded })
            );
            return { ...state, Labels };
        }
        case "UPDATE_LABEL_SET_RULE": {
            let Labels = updateItem(
                state.Labels,
                item => item.ID === action.ID,
                item => ({
                    ...item,
                    Rules: updateItem(
                        item.Rules,
                        r => r.rule === action.rule.rule,
                        r => ({ ...r, ...action.changes })
                    )
                })
            );
            return { ...state, Labels };
        }
        case "ADD_LABEL_SET_RULE": {
            let rules = action.rule;
            if (!isArray(rules)) {
                rules = [rules];
            }
            rules = rules.map(rule => {
                rule = { type: "POSITIVE", ...rule };
                return rule;
            });

            let Labels = updateItem(
                state.Labels,
                item => item.ID === action.ID,
                item => ({
                    ...item,
                    Rules: [...(item.Rules || []), ...rules]
                })
            );
            return { ...state, Labels };
        }
        case "REMOVE_LABEL_SET_RULE": {
            let Labels = updateItem(
                state.Labels,
                item => item.ID === action.ID,
                item => ({
                    ...item,
                    Rules: removeItem(item.Rules, r => r.rule === action.rule)
                })
            );
            return { ...state, Labels };
        }
        case "ADD_LABEL":
            if (!action.name) {
                return state;
            }
            return {
                ...state,
                Labels: [
                    {
                        ID: guid(),
                        Name: action.name,
                        expanded: false,
                        Rules: action.Rules || [
                            {
                                rule: action.name.toLowerCase(),
                                type: "POSITIVE"
                            }
                        ]
                    },
                    ...(state.Labels || [])
                ]
            };

        case "ADD_TO_SPECIAL_LABEL": {
            const Names = {
                IGNORE: "NOISE"
            };
            let lebel = state.Labels.find(l => l.TYPE === action.TYPE);
            let existent = !!lebel;
            let label = lebel
                ? { ...lebel }
                : {
                      ID: guid(),
                      Name: Names[action.TYPE],
                      TYPE: action.TYPE,
                      expanded: false,
                      Rules: []
                  };
            let rules = action.Rules.map(
                r =>
                    r.rule
                        ? { type: "POSITIVE", ...r }
                        : { rule: r, type: "{POSITIVE" }
            );

            let existentRules = new Set(label.Rules.map(r => r.rule));
            console.log({
                existenRules: label.Rules,
                newRules: rules,
                ignoreSet: existentRules
            });
            label.Rules = [
                ...label.Rules,
                ...rules.filter(r => !existentRules.has(r.rule))
            ];
            console.log("Final", label.Rules);

            return {
                ...state,
                Labels: existent
                    ? updateItem(state.Labels, d => d.ID === label.ID, label)
                    : [...state.Labels, label]
            };
        }
        case "REMOVE_LABEL_SET_LABEL": {
            return {
                ...state,
                Labels: state.Labels.filter(l => l.ID !== action.ID)
            };
        }
        default:
            break;
    }
    return state;
};
