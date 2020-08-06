import React from "react";
import { Link, useHistory } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import useFirebaseUser from "./hooks/useFirebaseUser";

function Navbar(props) {
  const user = useFirebaseUser();
  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton edge="start" color="inherit" aria-label="menu"></IconButton> */}
        <Typography variant="h6">Story Seeker</Typography>
        <Typography>{user ? user.displayName : "Login"}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
