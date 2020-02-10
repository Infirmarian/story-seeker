import React, { useEffect } from "react";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router";
function Pending(props) {
  const history = useHistory();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch(`${URL}/api/pending`, {
        method: "GET",
        headers: new Headers({
          Authorization: token,
        }),
      }).then((resp) => {
        resp.json().then((json) => {});
      });
    } else {
      history.push("/login");
    }
  }, [history]);
}
export default Pending;
