import React, { useEffect, useState } from "react";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Account() {
  const history = useHistory();
  const [authorData, setAuthorData] = useState({});
  useEffect(() => {
    fetch(`${URL}/api/current_user/details`).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          console.log(json);
          setAuthorData(json);
        });
      } else {
        //history.push("/login");
      }
    });
  }, [history, setAuthorData]);
  return (
    <>
      <Navbar
        links={[
          { link: "/viewer", text: "All Stories" },
          { link: "/account", text: "Account" },
        ]}
      />
      <div className="row">
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Account Details</h4>
          <div>
            <h6>Name</h6>
            <p>{authorData.name}</p>
          </div>
          <div>
            <h6>Email Address</h6>
            <p>{authorData.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
