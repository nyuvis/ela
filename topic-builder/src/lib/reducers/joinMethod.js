export const setJoinMethod = joinMethod => ({
    type: "SET_JOIN_METHOD",
    joinMethod
});

export default (state = { ALL: [], ANY: [], NOT: [] }, action) => {
    switch (action.type) {
        default:
            break;
    }
    return state;
};
