import { connect } from "react-redux";
import { addNode } from "../duck/actions";
import ToolbarComponent from "./ToolbarComponent";

const mapStateToProps = (state) => ({
	model: state.story.model,
});

const mapDispatchToProps = (dispatch) => ({
	addNode: () => {
		dispatch(addNode());
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ToolbarComponent);
