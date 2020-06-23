import { setContext, setDataset, setTextField } from "./dataset";
import {
    setLabelSet,
    addLabel,
    setLabelSetName,
    setLabelSetExpanded,
    addLabelSetRule,
    removeLabelSetLabel,
    removeLabelSetRule,
    updateLabelSetRule,
    addToSpecialLabel
} from "./labelSet";
import { setLayout } from "./layout";
import {
    searchAddKeyword,
    projectionSetSelection,
    searchRemoveKeyword,
    labelsSetSelection,
    searchSetKeyword,
    setJoinMethod,
    setFilter,
    addLabelIDToJoinMethod,
    setSelectedSuggestion,
    updateSelectedSuggestion
} from "./filter";

import { addIgnoredKeywords } from "./ignoredKeywords";

const execute = action => action;

export default {
    setContext,
    setDataset,
    setLabelSet,
    setLayout,
    searchAddKeyword,
    projectionSetSelection,
    searchRemoveKeyword,
    setJoinMethod,
    setTextField,
    addLabel,
    setLabelSetName,
    setLabelSetExpanded,
    removeLabelSetLabel,
    addLabelSetRule,
    labelsSetSelection,
    removeLabelSetRule,
    updateLabelSetRule,
    searchSetKeyword,
    addIgnoredKeywords,
    setFilter,
    addToSpecialLabel,
    addLabelIDToJoinMethod,
    setSelectedSuggestion,
    execute,
    updateSelectedSuggestion
};
