import NavBar from "./components/NavBar.jsx";
import Stage1Basics from "./components/Stage1Basics.jsx";
import Stage2Grid from "./components/Stage2Grid.jsx";
import MenuGrid from "./components/MenuGrid.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Stage1Basics />
        <Stage2Grid />
        <MenuGrid />
      </div>
    </>
  );
}

export default App;
