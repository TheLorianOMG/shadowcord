"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to LogOut?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account and exit the
              chat?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SignOut />
          </AlertDialogFooter>
        </AlertDialogContent>
        <header className="z-50">
          <Alert>
            <AlertTitle>Shadowcord by Lorian 🌆</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
            <AlertDialogTrigger asChild>
              {auth.currentUser && (
                <button className="cursor-pointer bg-transparent">
                  SignOut
                </button>
              )}
            </AlertDialogTrigger>
          </Alert>
        </header>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </AlertDialog>
    </div>
  );
}

function SignIn() {
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  return (
    <>
      <Button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
      <p className="text homepageText">
        Sign in with your google account to join in the chat !
      </p>
      <div className="flex justify-center items-center mt-5">
        <img
          src="https://i.imgur.com/vGX6K7p.png"
          className="spin w-36"
          alt="Lorian Think"
        />
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Continue</Button>
  );
}

function ChatRoom() {
  const dummy = useRef();

  const recentMessagesQuery = query(
    collection(getFirestore(), "messages"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  // @ts-ignore
  const [messages] = useCollectionData(recentMessagesQuery, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await addDoc(collection(getFirestore(), "messages"), {
      name: getAuth().currentUser.displayName,
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

        <span ref={dummy} />
      </main>

      <form onSubmit={sendMessage} className="mb-4">
        <Input
          placeholder="Type your message here."
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <Button type="submit" disabled={!formValue}>
          Send
          <Send className="pl-2" />
        </Button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, name, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div>
      <div className={`message ${messageClass} gap-2 flex`}>
        <Avatar>
          <AvatarImage src={photoURL} alt="" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <p className="text messageBubble">
          <Badge>{`${name}`}</Badge>
          <br /> {text}
        </p>
      </div>
    </div>
  );
}

export default App;
