import React from "react";
import Workspace from "./Workspace/WorkspaceContainer";
import ContentEditor from "./ContentEditor/ContentEditorContainer";
import Toolbar from "./Toolbar/ToolbarContainer";
import "./StoryBuilder.css";

//Redux integration
import store from "../../store";
import { Provider } from "react-redux";

function StoryBuilder() {
  return (
    <Provider store={store}>
      <div className="StoryBuilder">
        <div className="Workspace">
          <Workspace />
          <Toolbar />
        </div>
        <ContentEditor />
      </div>
    </Provider>
  );
}

export default StoryBuilder;
