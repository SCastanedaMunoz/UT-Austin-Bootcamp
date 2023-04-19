import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import BookCard from "../components/ResultCard";
import API from "../util/API";
import { fade, makeStyles } from "@material-ui/core/styles";

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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(0),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  searchButton: {
    marginTop: "1em",
  },
  noResultsHeader: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: ".5em",
  },
}));

function Books({ searchRef, onSearch, books }) {
  const classes = useStyles();

  const onSaveBook = (id) => {
    const targetBook = books.find((book) => book.id === id);
    const volumeInfo = targetBook.volumeInfo;
    const title = volumeInfo.title;
    const subtitle = volumeInfo.subtitle;
    const authors = volumeInfo.authors;
    const description = volumeInfo.description;
    const image = volumeInfo.imageLinks
      ? volumeInfo.imageLinks.thumbnail
      : "https://via.placeholder.com/128x197?text=Image+Not+Found";
    const link = volumeInfo.previewLink;

    API.saveBook({
      title: title,
      subtitle: subtitle,
      authors: authors,
      description: description,
      image: image,
      link: link
    })
  };

  const searchBar = () => {
    return (
      <Paper className={classes.paper}>
        <Typography className={classes.header} variant="h6">
          Book Search
        </Typography>
        <p className={classes.subHeader}>Book</p>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            fullWidth={true}
            inputRef={searchRef}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <Grid container justify="flex-end">
          <Button
            onClick={onSearch}
            justify="space-between"
            variant="contained"
            className={classes.searchButton}
          >
            Search
          </Button>
        </Grid>
      </Paper>
    );
  };

  const resultBox = () => {
    const hasResults = books.length > 0;
    const selection = hasResults ? renderResults() : renderNoResults();
    return (
      <Paper className={classes.paper}>

        {selection}
      </Paper>
    );
  };

  const renderNoResults = () => {
    return (
      <Paper className={classes.resultPaper}>
        <Typography className={classes.noResultsHeader} variant="h4">
          No Results Yet! Try Searching...
        </Typography>
      </Paper>
    );
  };

  const renderResults = () => {
    return (
      <Paper className={classes.resultPaperFilled}>
        <Typography className={classes.header} variant="h6">
          Results
        </Typography>
        {books.map((book) => {
          const volumeInfo = book.volumeInfo;
          const image = volumeInfo.imageLinks
            ? volumeInfo.imageLinks.thumbnail
            : "https://via.placeholder.com/128x197?text=Image+Not+Found";
          return (
            <BookCard
              id={book.id}
              key={book.id}
              title={volumeInfo.title}
              subtitle={volumeInfo.subtitle}
              authors={volumeInfo.authors}
              description={volumeInfo.description}
              thumbnail={image}
              link={volumeInfo.previewLink}
              onAction={onSaveBook}
            ></BookCard>
          );
        })}
      </Paper>
    );
  };

  return (
    <div className={classes.root}>
      {searchBar()}
      {resultBox()}
    </div>
  );
}

export default Books;
