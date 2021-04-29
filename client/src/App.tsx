import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuid } from "uuid";

import { TextEditor } from "./components";
import "./styles.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/documents/:id" component={TextEditor} />
        <Redirect to={`/documents/${uuid()}`} />
      </Switch>
    </Router>
  );
}

export default App;
