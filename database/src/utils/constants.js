import { useHistory } from "react-router";

let defURL = "https://mgmt.storyseeker.fun";
if (process.env.REACT_APP_SERVER_STATE === "DEVELOPMENT") {
  defURL = "http://localhost:5000";
}

function APICall(method, url) {
  const history = useHistory();
  const token = sessionStorage.getItem("token");
  if (!token) history.push("/login");
  fetch(url, {
    method,
    headers: new Headers({
      Authorization: token,
    }),
  }).then((resp) => {
    if (resp.ok) {
      resp.json().then((json) => {
        return json;
      });
    }
  });
}

export const URL = defURL;
