import { connect } from "react-redux";
import { addNode, removeNode, updateStartNode } from "../duck/actions";
import ToolbarComponent from "./ToolbarComponent";

const mapStateToProps = (state) => ({
	selectedNode: state.story.selectedNode,
});

const mapDispatchToProps = (dispatch) => ({
	addNode: () => {
		dispatch(addNode());
	},
	removeNode: (node) => {
		dispatch(removeNode(node));
	},
	updateStartNode: (node) => {
		dispatch(updateStartNode(node));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ToolbarComponent);
