import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import useFirebaseUser from "../../components/hooks/useFirebaseUser";
import Spinner from "../../components/Spinner";
import Navbar from "../../components/Navbar";
import { Firestore } from "../../components/Firebase";
export default function StoryOverview() {
  const { id } = useParams();
  const user = useFirebaseUser();
  const history = useHistory();
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    if (user)
      Firestore()
        .collection("stories")
        .doc(id)
        .get()
        .then((doc) => setState({ loading: false }))
        .catch(() => history.push("/404"));
  }, [user, id, history]);
  return (
    <>
      <Navbar />{" "}
      {state.loading ? (
        <Spinner />
      ) : (
        <h1>
          Got story for {id}
          <Link to={`/story/${id}/edit`}>Edit Story</Link>
        </h1>
      )}
    </>
  );
}
