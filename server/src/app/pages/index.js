import { Switch, Route } from "react-router-dom";
import StoryBuilder from "./StoryBuilder/StoryBuilder";
import LoginPage from "./LoginPage/Login";
import StoryViewer from "./StoryViewer/StoryViewer";
import Home from "./HomePage/Home";

import React from "react";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/builder" component={StoryBuilder} />
      <Route path="/viewer" component={StoryViewer} />
    </Switch>
  );
}

export default Routes;
