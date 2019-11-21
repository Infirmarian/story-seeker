import { useState } from "react";
export const useInput = (initialState, setterFunction, node) => {
	const [value, setValue] = useState(initialState);

	return {
		value,
		setValue,
		reset: () => {
			setterFunction.call(node, initialState);
			setValue(initialState);
		},
		bind: {
			value,
			onChange: (event) => {
				setterFunction.call(node, event.target.value);
				setValue(event.target.value);
			},
		},
	};
};
