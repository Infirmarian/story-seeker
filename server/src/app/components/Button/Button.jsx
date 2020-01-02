import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

function Button(props) {
	// Button usage: <Button {...props} >{children}</Button>
	// variant (TODO if necessary): specifies the type of button to be rendered; see material-UI button variants
	// color: specifies color theme of button; 'primary' | 'secondary' | 'alert'
	// size: specifies padding size of button; sm | md | lg | xl
	// type: specifies defauly HTML element button type; 'button' | 'reset' | 'submit'
	// onClick: specifies onClick event handler
	// disabled: specifies whether button is disabled; true | false
	// link: pass in the route that the button should navigate to on click
	// href: use for internal page navigation (jump to element with id)
	const { variant, color, size, type, onClick, disabled, link, href } = props;

	const Component = props.component || href ? "a" : link ? Link : "button";

	const attributes = {
		onClick,
	};
	if (link) attributes.to = link;
	if (disabled) attributes.disabled = disabled;
	if (type) attributes.type = type;
	if (href) attributes.href = href;

	const btnVariant = variant ? `btn-${variant}` : "btn";
	const btnColor = disabled
		? "btn-disabled"
		: color
		? `btn-${color}`
		: "btn-primary";
	const btnSize = size ? `btn-${size}` : "";
	const first = props.first ? "ml-0" : "";

	const classes = [btnVariant, btnColor, btnSize, first, props.className].join(
		" ",
	);

	return (
		<Component className={classes} {...attributes}>
			<span>{props.children}</span>
		</Component>
	);
}

export default Button;
