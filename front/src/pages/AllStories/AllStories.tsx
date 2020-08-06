import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Firestore } from "../../components/Firebase";
import Spinner from "../../components/Spinner";
import Navbar from "../../components/Navbar";
import useFirebaseUser from "../../components/hooks/useFirebaseUser";

interface Story {
  author: string;
  id: string;
  genre: string;
  status: string;
  title: string;
  price: number;
}
interface State {
  stories: Story[];
  loading: boolean;
}

export default function AllStories() {
  const [state, setState] = useState<State>({
    stories: [],
    loading: true,
  });
  const user = useFirebaseUser();

  useEffect(() => {
    if (user) {
      Firestore()
        .collection("/stories")
        .where("author", "==", user.uid)
        .get()
        .then((snapshot) => {
          setState((s) => ({
            loading: false,
            stories: snapshot.docs.map((d) => ({
              author: d.data().author,
              id: d.id,
              status: d.data().status,
              genre: d.data().genre,
              title: d.data().title,
              price: d.data().price,
            })),
          }));
        });
    }
  }, [user]);
  return (
    <div>
      <Navbar />
      {state.loading ? (
        <Spinner />
      ) : (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Report</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.stories.map((s) => (
              <TableRow key={s.id}>
                <TableCell component="th" scope="row">
                  {s.title}
                </TableCell>
                <TableCell component="th" scope="row">
                  {s.genre}
                </TableCell>
                <TableCell component="th" scope="row">
                  {s.status}
                </TableCell>
                <TableCell component="th" scope="row">
                  {s.price}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link to={`/story/${s.id}/overview`}>Edit</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
