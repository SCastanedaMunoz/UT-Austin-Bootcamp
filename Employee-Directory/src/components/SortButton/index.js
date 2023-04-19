import Col from "../Col";

function SortButton({ first, last, callback }) {
  return (
    <Col size="md-5">
      <button onClick={callback} className="btn btn-danger">{first} <i className="fa fa-arrow-right" /> {last}</button>
    </Col>
  );
}

export default SortButton;
