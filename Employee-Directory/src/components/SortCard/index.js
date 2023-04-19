import Container from "../Container";
import SortHolder from "../SortHolder";
import FilterInput from "../FilterInput";
import "./style.css";

function SortCard({ lastAtoZ, lastZtoA, firstAtoZ, firstZtoA, inputChanged }) {
  return (
    <div>
      <div className="s card text-center">
        <Container fluid={true}>
          <FilterInput inputChanged={inputChanged}></FilterInput>
          <SortHolder
            lastAtoZ={lastAtoZ}
            lastZtoA={lastZtoA}
            firstAtoZ={firstAtoZ}
            firstZtoA={firstZtoA}
          ></SortHolder>
        </Container>
      </div>
    </div>
  );
}

export default SortCard;
