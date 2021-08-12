import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Articles from "./app/component/Article";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Articles} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
