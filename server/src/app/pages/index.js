import { Switch, Route } from "react-router-dom";
import StoryBuilder from "./StoryBuilder/StoryBuilder";
import LoginPage from "./LoginPage/Login";
import StoryViewer from "./StoryViewer/StoryViewer";
import StoryDetails from "./StoryDetails/StoryDetails";
import StoryPreview from "./StoryPreview/StoryPreview";
import Home from "./HomePage/Home";

import React from "react";
import Page404 from "./Page404/Page404";
import Account from "./Account/Account";
import StoryReport from "./StoryReport/StoryReport";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/account" component={Account} />
      <Route path="/builder/:id" component={StoryBuilder} />
      <Route exact path="/viewer" component={StoryViewer} />
      <Route path="/viewer/details/:id" component={StoryDetails} />
      <Route path="/viewer/report/:id" component={StoryReport} />
      <Route path="/viewer/new" component={StoryDetails} />
      <Route path="/preview/:id" component={StoryPreview} />
      <Route path="/error" component={Page404} />
      <Route component={Page404} />
    </Switch>
  );
}

export default Routes;
