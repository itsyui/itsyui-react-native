import { CardActions } from './actions';

const initialState = {
	data: null,
	isExpand: false,
};

function reducer(state, action) {
	switch (action.type) {
		case CardActions.DataAvailable:
			return {
				...state,
				data: action.data
			};
		case CardActions.Expand:
			return {
				...state,
				isExpand: true,
			};
		case CardActions.Collapse:
			return {
				...state,
				isExpand: false,
			}
		default:
			return state === undefined ? initialState :
				Object.keys(state).length === 0 ? initialState : state;
	}
}

export default reducer;