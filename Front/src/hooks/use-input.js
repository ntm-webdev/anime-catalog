import { useReducer } from "react";

const actions = {
  SET_VALUE: "SET_VALUE",
  CLEAN: "CLEAN",
};

const initialState = {
  value: "",
  isValid: false,
  isTouched: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_VALUE:
      return {
        value: action.payload.value,
        isValid: action.payload.validationRule,
        isTouched: true,
      };
    case actions.CLEAN:
      return {
        value: "",
        isValid: false,
        isTouched: false,
      };
    default:
      return initialState;
  }
};

const useInput = (validationRule) => {
  const [input, dispatchInput] = useReducer(reducer, initialState);

  const onChangeHandler = (e) => {
    let val = e.target.name === "image" ? e.target.files[0] : e.target.value;
    dispatchInput({
      type: actions.SET_VALUE,
      payload: {
        value: val,
        validationRule: validationRule(e.target.value),
      },
    });
  };

  const onCleanHandler = () => {
    dispatchInput({
      type: actions.CLEAN,
    });
  };

  return {
    onChangeHandler: onChangeHandler,
    onCleanHandler: onCleanHandler,
    isValid: input.isValid,
    value: input.value,
    isTouched: input.isTouched,
  };
};

export default useInput;
