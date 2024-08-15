import { useState, useEffect, ReactElement } from "react";
import { auth, db } from "@/services/firebase";
import Loading from "../ui/Loading";
import {
  setDoc,
  query,
  where,
  collection,
  doc,
  getDocs,
} from "firebase/firestore";

export default function SessionProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    await auth.onAuthStateChanged(function (user) {
      /** create user document only for new user */
      if (user) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", userId));

        getDocs(q).then((querySnapShot) => {
          if (querySnapShot.docs.length === 0) {
             setDoc(doc(db, "users", user.uid), {
              username: user.displayName,
              user_id: user.uid,
            });
          }
        });
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    init();
    return () => {
      // cleanup
    };
  }, []);

  return <div>{isLoading ? <Loading /> : children}</div>;
}
