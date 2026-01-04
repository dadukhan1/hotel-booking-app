import React from "react";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div className="text-3xl font-bold underline">
      {!isOwnerPath && <Navbar />}
    </div>
  );
};

export default App;
