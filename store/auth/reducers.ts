import Immutable from "immutable";

export const initialState = Immutable.fromJS({});

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
