const actions = {
    TOGGLE_LOADER: 'TOGGLE_LOADER',
    toggleLoader: (payload) => ({
        type: actions.TOGGLE_LOADER,
        payload
    }),
    BASIC_FETCH: 'BASIC_FETCH',
    basicFetch: (payload) => ({
        type: actions.BASIC_FETCH,
        payload
    })
};

export default actions;