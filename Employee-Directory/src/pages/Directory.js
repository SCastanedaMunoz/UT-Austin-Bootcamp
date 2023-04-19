import API from "../utils/API";
import { Component } from "react";
import Header from "../components/Header";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";
import UserCard from "../components/UserCard";
import FilterCard from "../components/SortCard";

class Directory extends Component {
  state = {
    users: [],
    input: "",
    fetchFinished: false,
  };

  componentDidMount() {
    API.getUsers(20).then((res) => {
      const allUsers = res.data.results;
      //   setFilterUsers(allUsers);
      this.setState({ users: allUsers, fetchFinished: true });
    });
  }

  inputChanged = (event) => {
    this.setState({ input: event.target.value });
  };

  lastAtoZ = () => {
    const sortedUsers = this.state.users.sort((a, b) =>
      a.name.last.localeCompare(b.name.last)
    );
    this.setState({ users: sortedUsers });
  };

  lastZtoA = () => {
    const sortedUsers = this.state.users.sort((a, b) =>
      b.name.last.localeCompare(a.name.last)
    );
    this.setState({ users: sortedUsers });
  };

  firstAtoZ = () => {
    const sortedUsers = this.state.users.sort((a, b) =>
      a.name.first.localeCompare(b.name.first)
    );
    this.setState({ users: sortedUsers });
  };

  firstZtoA = () => {
    const sortedUsers = this.state.users.sort((a, b) =>
      b.name.first.localeCompare(a.name.first)
    );
    this.setState({ users: sortedUsers });
  };

  render() {
    const { users, input } = this.state;

    if (this.state.fetchFinished) {
      const filteredUsers = users.filter((user) =>
        `${user.name.first} ${user.name.last}`
          .toLowerCase()
          .includes(input.toLowerCase())
      );

      return (
        <div>
          <Header
            title="Employee Directory!"
            icon="fa fa-address-book-o"
          ></Header>
          <Container fluid={true}>
            <Row>
              <Col size="md-5">
                <FilterCard
                  lastAtoZ={this.lastAtoZ}
                  lastZtoA={this.lastZtoA}
                  firstAtoZ={this.firstAtoZ}
                  firstZtoA={this.firstZtoA}
                  inputChanged={this.inputChanged}
                ></FilterCard>
              </Col>
            </Row>
            <Row>
              <Col size="md-5">
                {filteredUsers.map((user) => {
                  console.log(user);
                  return (
                    <UserCard
                      key={user.email}
                      name={`${user.name.first} ${user.name.last}`}
                      email={user.email}
                      phone={user.phone}
                      picture={user.picture.large}
                      gender={user.gender}
                      location={user.location}
                      age={user.dob.age}
                    />
                  );
                })}
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Directory;
