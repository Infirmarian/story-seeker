import React from "react";
import "./InputField.css";

function InputField(props) {
	const {
		field,
		size,
		type,
		name,
		label,
		value,
		onFocus,
		onChange,
		onBlur,
		placeholder,
		autocomplete,
		pattern,
		enabled,
		required,
		error,
	} = props;

	const InputComponent = field || "input";

	const attributes = {
		type,
		name,
		id: name,
		placeholder: placeholder || `Enter ${name}`,
		value,
		onChange,
		onFocus,
		onBlur,
	};
	if (autocomplete) attributes.autoComplete = autocomplete;
	if (pattern) attributes.pattern = pattern;
	if (required) attributes.required = required;
	if (enabled) attributes.enabled = enabled;

	const fieldSize = size ? `form-control-${size}` : "";
	var validity = "form-control";
	const classes = [validity, fieldSize, props.className].join(" ");
	console.log(error);
	return (
		<div>
			<label className="input-labels" htmlFor={name}>
				{label || name}
			</label>
			<InputComponent className={classes} {...attributes}>
				{props.children}
			</InputComponent>
			{error ? <div className="invalid-feedback">{error}</div> : null}
		</div>
	);
}

export default InputField;
