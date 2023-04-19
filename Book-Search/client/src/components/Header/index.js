import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    textAlign: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: "2em",
    backgroundColor: "#424242",
  },
  header: {
    fontWeight: "bold",
    color: "white",
  },
  subHeader: {
    fontWeight: 500,
    color: "white",
  },
}));

function Header() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} display="flex" justifycontent="center">
        <Typography className={classes.header} variant="h4">
          (REACT) Google Books Search
        </Typography>
        <Typography className={classes.subHeader} variant="h6">
          Search for and Save Books of Interest
        </Typography>
      </Paper>
    </div>
  );
}

export default Header;
