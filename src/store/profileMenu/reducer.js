const initialState = {
  trigger: 0,
};

const profileTrigger = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT_PROFILE_TRIGGER":
      return {
        ...state,
        trigger: state.trigger + 1,
      };
    default:
      return state;
  }
};

export default profileTrigger;
