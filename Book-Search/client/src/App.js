import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Header from "./components/Header";
import Books from "./pages/Books";
import Saved from "./pages/Saved";
import NoMatch from "./pages/NoMatch";
import API from "./util/API";
import { useState, useRef } from "react";

function App() {
  const searchInput = useRef(null);
  const [lastSearch, setLastSearch] = useState("");
  const [books, setBooks] = useState([]);

  const onSearch = () => {
    const newSearch = searchInput.current.value;
    setLastSearch(newSearch);
    API.getBooks(newSearch).then(({ data }) => {
      setBooks(data.items);
    });
  };

  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Header />
          <Books
            searchRef={searchInput}
            onSearch={onSearch}
            books={books}
          />
        </Route>
        <Route exact path="/saved">
          <Header />
          <Saved />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
