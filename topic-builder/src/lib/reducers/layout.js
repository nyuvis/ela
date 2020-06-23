export const setLayout = layout => ({ type: "SET_LAYOUT", layout });

export const DISCOVERY_PANEL_SIZE = 350;
export const DETAILS_PANEL_SIZE = 400;

export default (
    state = {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        discoveryPanel: DISCOVERY_PANEL_SIZE,
        detailsPanel: DETAILS_PANEL_SIZE
    },
    action
) => {
    switch (action.type) {
        case "SET_LAYOUT":
            return { ...state, ...action.layout };
        default:
            break;
    }
    return state;
};
