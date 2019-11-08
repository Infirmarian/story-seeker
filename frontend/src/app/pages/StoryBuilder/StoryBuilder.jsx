import React from "react";
import Workspace from "./Workspace/WorkspaceContainer";
import Toolbar from "./Toolbar/ToolbarContainer";
import "./StoryBuilder.css";

function StoryBuilder() {
	return (
		<div className="StoryBuilder">
			<Workspace />
			<Toolbar />
		</div>
	);
}

export default StoryBuilder;
