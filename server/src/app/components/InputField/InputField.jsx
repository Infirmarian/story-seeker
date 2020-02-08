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
	const classes = ["form-control", fieldSize, props.className].join(" ");

	return (
		<div>
			<label className="input-labels" htmlFor={name}>
				{label || name}
			</label>
			<InputComponent className={classes} {...attributes}>
				{props.children}
			</InputComponent>
			<div className="invalid-feedback">{error}</div>
		</div>
	);
}

export default InputField;
