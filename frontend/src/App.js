import React, { useState } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import "./App.css";

export default function App() {
  const [session, setSession] = useState({
    authenticated: false,
    user: {},
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmIwZDVlOTA5NWRmZjUxZjA1Yjc3ODYiLCJyb2xlIjoidXNlciIsImlhdCI6MTYwNTQyODg5NywiZXhwIjoxNjA5MDI4ODk3fQ.f1zERkQkqpDdZcAo5Olf-rCnCZWKDHyhiXHvSkzh888",
  });

  return (
    <div className="app">
      {session.authenticated ? (
        <Feed session={session} />
      ) : (
        <Login setSession={setSession} />
      )}
    </div>
  );
}
