import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

function Button(props) {
	const { variant, type, onClick, disabled, link, href } = props;

	const Component = props.component || href ? "a" : link ? Link : "button";

	const attributes = {
		onClick,
	};
	if (link) attributes.to = link;
	if (disabled) attributes.disabled = disabled;
	if (type) attributes.type = type;
	if (href) attributes.href = href;

	const btnVariant = variant ? `btn-${variant}` : "btn";
	const color = disabled
		? "btn-disabled"
		: props.color
		? `btn-${props.color}`
		: "btn-primary";
	const size = props.size ? `btn-${props.size}` : "";
	const first = props.first ? "ml-0" : "";

	const classes = [btnVariant, color, size, first, props.className].join(" ");

	return (
		<Component style={{}} className={classes} {...attributes}>
			<span>{props.children}</span>
		</Component>
	);
}

export default Button;
