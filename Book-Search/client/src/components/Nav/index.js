import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  Button,
  Container,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SaveIcon from "@material-ui/icons/Save";
import BookIcon from "@material-ui/icons/Book";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#333333",
  },
  navbarDisplayFlex: {
    display: `flex`,
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function Nav() {
  const navLinks = [
    { title: "Search", path: "/", icon: <SearchIcon /> },
    { title: "Saved", path: "/saved", icon: <SaveIcon /> },
  ];

  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Container maxWidth="lg" className={classes.navbarDisplayFlex}>
          <Button
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            endIcon={<BookIcon />}
          >
            Google Books
          </Button>
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={classes.navDisplayFlex}
          >
            {navLinks.map(({ title, path, icon }) => (
              <ListItem key={title}>
                <Button
                  href={path}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="home"
                  endIcon={icon}
                >
                  {title}
                </Button>
              </ListItem>
            ))}
          </List>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
