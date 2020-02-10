import React from "react";

function Forbidden() {
  return (
    <>
      <h1>You don't have permissions to access this</h1>
      <h5>
        If you are interested in joining our moderation team, please
        <a href="mailto:admin@storyseeker.fun"> contact us</a>
      </h5>
    </>
  );
}

export { Forbidden };
