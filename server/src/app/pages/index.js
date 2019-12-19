import { Switch, Route } from "react-router-dom";
import StoryBuilder from "./StoryBuilder/StoryBuilder";
import LoginPage from "./LoginPage/Login";
import StoryViewer from "./StoryViewer/StoryViewer";
import StoryDetails from "./StoryDetails/StoryDetails";
import Home from "./HomePage/Home";

import React from "react";
import Page404 from "./Page404/Page404";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/builder/:id" component={StoryBuilder} />
      <Route exact path="/viewer" component={StoryViewer} />
      <Route path="/viewer/details/:id" component={StoryDetails} />
      <Route path="/viewer/new" component={StoryDetails} />
      <Route component={Page404} />
    </Switch>
  );
}

export default Routes;
