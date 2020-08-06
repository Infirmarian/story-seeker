import { useState, useEffect } from "react";
import { Auth } from "../Firebase";

export default function useFirebaseUser() {
  const [user, setUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    const unsubscribe = Auth().onAuthStateChanged((u) => {
      if (u !== user) {
        console.log(`updated user to ${u}`);
        setUser(u);
      }
    });
    return () => unsubscribe();
  });
  return user;
}
