import { isArray } from "lodash";
export const addIgnoredKeywords = keywords => ({
    type: "ADD_IGNORED_KEYWORDS",
    keywords: isArray(keywords) ? keywords : [keywords]
});

export default (state = [], action) => {
    switch (action.type) {
        case "ADD_IGNORED_KEYWORDS":
            return [...state, ...action.keywords];

        default:
            break;
    }
    return state;
};
