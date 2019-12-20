import React from "react";
import Workspace from "./Workspace/WorkspaceContainer";
import ContentEditor from "./ContentEditor/ContentEditorContainer";
import Toolbar from "./Toolbar/ToolbarContainer";
import Navbar from "../../components/Navbar";
import "./StoryBuilder.css";

//Redux integration
import store from "../../store";
import { Provider } from "react-redux";

function StoryBuilder(props) {
  const { id } = props.match.params;
  return (
    <Provider store={store}>
      <div className="StoryBuilder">
        <div className="Workspace">
          <Navbar />
          <Workspace id={id} />
          <Toolbar />
        </div>
        <ContentEditor />
      </div>
    </Provider>
  );
}

export default StoryBuilder;
