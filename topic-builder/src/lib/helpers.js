import { flattenDeep, last } from "lodash";
export const getHighlights = ({
    selectedTopics,
    Topics,
    filters = { filters: [] }
}) => {
    return (
        selectedTopics &&
        flattenDeep(
            selectedTopics
                .map(topicId =>
                    (
                        Topics.find(t => t.ID === topicId) || {
                            Keywords: []
                        }
                    ).Keywords.map(k => k.Keyword)
                )
                .concat(filters.filters.map(f => f.query))
        )
    );
};

const breakRule = rule => {
    rule = rule
        .replace(/ AND /gi, " ")
        .replace(/ OR /gi, " ")
        .replace(/~[0-9]+/, "")
        .replace(/"/g, "");
    rule = rule
        .split(" ")
        .map(r => r.trim())
        .filter(r => r);
    return rule;
};

export const collectKeywords = (Topics = [], filters = {}) => {
    filters = filters.filters;
    let keywords = new Set();
    Topics = Topics || [];

    for (let topic of Topics) {
        for (let rule of topic.Keywords.map(k => k.Keyword)) {
            rule = breakRule(rule);
            for (let r of rule) {
                keywords.add(r);
            }
        }
    }
    for (let query of filters) {
        let rule = breakRule(query.query);
        for (let r of rule) {
            keywords.add(r);
        }
    }
    return Array.from(keywords);
};

export const topicToFilter = (Topic, textField) => {
    return {
        field: textField && textField.ID,
        scoredKeywords: {
            function: "SIGMOID",
            keywords: Topic.Keywords.map(({ Keyword, Weight }) => ({
                Keyword,
                Weight
            })),
            threshold: Topic.Threshold || 0.5
        }
    };
};

export const prepareFilters = (
    filters,
    topics,
    selectedTopics,
    textField,
    operation = "and",
    ids,
    joinMethod
) => {
    filters = (filters && filters.filters) || [];
    let filtersQuery = filters.map(f => ({
        ...f,
        field:
            f.field === "<default>" || !f.field
                ? textField && textField.ID
                : f.field
    }));
    let filterTopics = [];

    if (topics) {
        filterTopics = topics.filter(t => selectedTopics.indexOf(t.ID) > -1);
    } else {
        filterTopics = selectedTopics;
    }

    filterTopics = filterTopics.map(t => ({
        field: textField && textField.ID,
        scoredKeywords: {
            function: "SIGMOID",
            keywords: t.Keywords.map(({ Keyword, Weight }) => ({
                Keyword,
                Weight
            })),
            threshold: t.Threshold || 0.5
        }
    }));

    if (filtersQuery.length + filterTopics.length === 0) {
        return [];
    }

    return { and: [...filterTopics, ...filtersQuery] };
};
