import React from "react";
import "./style.css";
import Hyperlink from "../Hyperlink";
import Row from "../Row";
import Col from "../Col";
import Container from "../Container";

function UserCard({ name, email, phone, picture, gender, location, age }) {
  return (
    <div>
      <div className="card text-center">
        <div className="card-header">
          <Container fluid={true}>
            <Row>
              <Col size="md-12">
                <img
                  className="image-fluid"
                  src={picture}
                  alt={`${name}_picture`}
                />
              </Col>
              <Col size="md-12">
                <h2>
                  {name}{" "}
                  <i
                    className={`gender fas fa-${
                      gender === "male" ? "mars" : "venus"
                    }`}
                  />
                </h2>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="card-body">
          <p>Age: {age}</p>
          <p>
            Address:{" "}
            {`${location.street.name}, ${location.city}, ${location.state}, ${location.postcode}`}
          </p>
          <Hyperlink
            link={`mailto:${email}`}
            text={`Email: ${email}`}
          ></Hyperlink>
          <Hyperlink
            link={`tel:${phone}`}
            text={`Phone: ${phone}`}
          ></Hyperlink>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
