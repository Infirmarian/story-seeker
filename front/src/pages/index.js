import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home/Home";
import Login from "./Login/Login";
import AllStories from "./AllStories/AllStories";
import StoryOverview from "./StoryOverview/StoryOverview";
import StoryEditor from "./StoryEditor/StoryEditor";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route exact path="/story" component={AllStories} />
      <Route path="/story/:id/overview" component={StoryOverview} />
      <Route path="/story/:id/edit" component={StoryEditor} />
      {/*
      <Route path="/account" component={Account} />
      <Route path="/builder/:id" component={StoryBuilder} />
      <Route exact path="/viewer" component={StoryViewer} />
      <Route path="/viewer/details/:id" component={StoryDetails} />
      <Route path="/viewer/report/:id" component={StoryReport} />
      <Route path="/viewer/new" component={StoryDetails} />
      <Route path="/preview/:id" component={StoryPreview} />
      <Route path="/error" component={Page404} />
      <Route component={Page404} /> */}
    </Switch>
  );
}
