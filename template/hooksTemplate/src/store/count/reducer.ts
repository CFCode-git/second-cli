const reducer = (state: ICount.State, action: ICount.Action) => {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + action.payload.num }
        case 'DECREMENT':
            return { count: state.count - action.payload.num }
        default:
            return state
    }
}
export default reducer
