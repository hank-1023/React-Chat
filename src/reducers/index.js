import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

const initialUserState = {
    currentUser: null,
    isLoading: true
}

const userRecuder = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...initialUserState,
                isLoading: false
            }
        default:
            return state;
    }
}

const initialChannelState = {
    currentChannel: null
}

const channelRducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user: userRecuder,
    channel: channelRducer
});

export default rootReducer;
