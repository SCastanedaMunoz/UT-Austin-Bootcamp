import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import API from "../util/API";
import BookCard from "../components/ResultCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "center",
    textAlign: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: "1em",
    backgroundColor: "#424242",
  },
  resultPaper: {
    padding: "1em",
    backgroundColor: "#5e5e5e",
  },
  resultPaperFilled: {
    paddingLeft: "1em",
    paddingRight: "1em",
    paddingTop: ".5em",
    paddingBottom: ".5em",
    backgroundColor: "#5e5e5e",
  },
  header: {
    fontWeight: "bold",
    color: "white",
  },
  subHeader: {
    fontWeight: 500,
    color: "white",
    marginTop: ".5em",
    marginBottom: ".5em",
  },
  noSavedHeader: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: ".5em",
  },
}));

function Saved() {
  const classes = useStyles();
  const [savedBooks, setSavedBooks] = useState([]);

  const getSavedBooks = () => {
    API.getSavedBooks().then(({ data }) => {
      setSavedBooks(data);
    });
  };

  const onDeleteSaved = (id) => {
    API.deleteBook(id)
      .then((res) => getSavedBooks());
  };

  useEffect(() => {
    getSavedBooks();
  }, []);

  const renderNoSaved = () => {
    return (<Paper className={classes.resultPaper}>
      <Typography className={classes.noSavedHeader} variant="h4">
        No Saved Books! Try Saving Some Books...
      </Typography>
    </Paper>);
  };

  const renderSaved = () => {
    return (<Paper className={classes.resultPaperFilled}>
      <Typography className={classes.header} variant="h6">
        Saved Books
      </Typography>
      {savedBooks.map((book) => {
        // Deal with MongoDB _id
        book.id = book._id;
        return (
          <BookCard
            id={book.id}
            key={book.id}
            title={book.title}
            subtitle={book.subtitle}
            authors={book.authors}
            description={book.description}
            thumbnail={book.image}
            link={book.link}
            onAction={onDeleteSaved}
            saved
          ></BookCard>
        );
      })}
    </Paper>);
  };

  const hasResults = savedBooks.length > 0;
  const selection = hasResults ? renderSaved() : renderNoSaved();

  return <div className={classes.root}>
    <Paper className={classes.paper}>
      {selection}
    </Paper>
  </div>;
}

export default Saved;
