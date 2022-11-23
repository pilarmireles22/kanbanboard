import React from "react";
import Tasks from "./Tasks/Tasks";

function App() {
  return (
    <div className="App">
      <div className="py-3 jumbotron bg-white text-center">
        <div className="container">
          <h1>Kanban Board</h1>
        </div>
      </div>
      <div className="container-fluid py-5 bg-light">
        <Tasks />
      </div>
      <footer className="text-muted py-4">
        <div className="container">
          
        </div>
      </footer>
    </div>
  );
}

export default App;
