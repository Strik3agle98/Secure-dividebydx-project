import React, { useState } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import "./App.css";

export default function App() {
  const [session, setSession] = useState({
    authenticated: true,
    userId: "",
    displayName: "",
  });

  return (
    <div className="app">
      {session.authenticated ? (
        <Feed displayName={session.displayName} />
      ) : (
        <Login setSession={setSession} />
      )}
    </div>
  );
}
