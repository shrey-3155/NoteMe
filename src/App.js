import { BrowserRouter,Routes,Route} from "react-router-dom";
import NotesList from "./NotesList";
import ModifyNote from "./ModifyNote";
import NewNote from "./NewNote";
import NoteDetail from "./NoteDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<NotesList />}></Route>
        <Route path="/edit" element={<ModifyNote />}></Route>
        <Route path="/create" element={<NewNote />}></Route>
        <Route path="/view" element={<NoteDetail />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
