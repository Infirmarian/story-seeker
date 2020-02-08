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
	}, [errors]);

	function handleChange(event) {
		const target = event.target;
		setValues((prev) => {
			const update = { ...prev, [target.name]: target.value };
			setErrors(validate(update));
			return update;
		});
	}

	function handleBlur() {
		const validationErrors = validate(values);
		console.log(validationErrors);
		setErrors(validationErrors);
	}

	function handleSubmit(event) {
		event.preventDefault();
		const validationErrors = validate(values);
		setErrors(validationErrors);
		setSubmitting(true);
	}

	return {
		values,
		setValues,
		errors,
		submitting,
		handleChange,
		handleSubmit,
		handleBlur,
	};
};
