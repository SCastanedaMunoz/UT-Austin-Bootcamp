import Row from "../Row";
import Col from "../Col";

function FilterInput({ inputChanged }) {
  return (
    <Row>
      <Col size="md-6">
        <h2>Filter Employees</h2>
        <Row>
          <Col size="md-12">
            <input type="search" className="form-control" placeholder="Find Employees by Name!" onChange={inputChanged} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default FilterInput;
