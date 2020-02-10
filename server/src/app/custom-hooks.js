import { useState, useEffect } from "react";

export const useFormValidation = (initialState, validate) => {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (submitting) {
			if (Object.keys(errors).length === 0) {
				console.log("authenticated!", values);
			}
			setSubmitting(false);
		}
	}, [errors, submitting, values]);

	function handleChange(event) {
		const target = event.target;
		setValues((prev) => {
			const update = { ...prev, [target.name]: target.value };
			setErrors(() => {
				const errors = validate(update);
				console.log(errors[target.name]);
				target.setCustomValidity(errors[target.name]);
				return errors;
			});
			return update;
		});
	}

	function handleBlur(event) {
		const target = event.target;
		setErrors(() => {
			const errors = validate(values);
			console.log(errors[target.name]);
			target.setCustomValidity(errors[target.name]);
			return errors;
		});
	}

	// function handleSubmit(event) {
	// 	event.preventDefault();
	// 	const validationErrors = validate(values);
	// 	setErrors(validationErrors);
	// 	setSubmitting(true);
	// }

	return {
		values,
		setValues,
		errors,
		submitting,
		handleChange,
		handleBlur,
	};
};
