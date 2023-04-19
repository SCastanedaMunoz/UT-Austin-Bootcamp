import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import RestoreIcon from "@material-ui/icons/Restore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    textAlign: "center",
    fontWeight: "bolder",
    fontSize: 200,
  },
  button: {
    marginTop: "1em",
  },
}));

function NoMatch() {
  const classes = useStyles();
  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" justifyContent="center">
        <Typography className={classes.typography}>404</Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography variation="h3">
          The content you are looking for doesn't seem to exist.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          href="/"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<RestoreIcon />}
        >
          Return
        </Button>
      </Box>
    </div>
  );
}

export default NoMatch;
