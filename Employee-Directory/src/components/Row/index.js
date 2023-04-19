function Row(props) {
    return <div className={`row${props.fluid ? "-fluid" : ""} ${props.classes ? props.classes : ""} justify-content-center`}>{props.children}</div>;
}

export default Row;
