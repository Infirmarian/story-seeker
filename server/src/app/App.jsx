import React from "react";
import Routes from "./pages";
import './App.css';
function App() {
  console.log(process.env.PUBLIC_URL);
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
