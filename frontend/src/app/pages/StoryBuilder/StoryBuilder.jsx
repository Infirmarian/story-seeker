import React from "react";
import Workspace from "./Workspace/WorkspaceContainer";
import ContentEditor from "./ContentEditor/ContentEditorContainer";
import Toolbar from "./Toolbar/ToolbarContainer";
import "./StoryBuilder.css";

function StoryBuilder() {
	return (
		<div className="StoryBuilder">
			<div className="Workspace">
				<Workspace />
				<Toolbar />
			</div>
			<ContentEditor />
		</div>
	);
}

export default StoryBuilder;
