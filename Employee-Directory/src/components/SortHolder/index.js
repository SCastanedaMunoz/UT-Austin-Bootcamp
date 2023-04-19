import Row from "../Row";
import Col from "../Col";
import SortButton from "../SortButton";

function SortHolder({ lastAtoZ, lastZtoA, firstAtoZ, firstZtoA }) {
  return (
    <Row>
      <Col size="md-6">
        <h2>First Name</h2>
        <Row>
          <SortButton first="A" last="Z" callback={firstAtoZ}></SortButton>
          <SortButton first="Z" last="A" callback={firstZtoA}></SortButton>
        </Row>
      </Col>
      <Col size="md-6">
        <h2>Last Name</h2>
        <Row>
          <SortButton first="A" last="Z" callback={lastAtoZ}></SortButton>
          <SortButton first="Z" last="A" callback={lastZtoA}></SortButton>
        </Row>
      </Col>
    </Row>
  );
}

export default SortHolder;
