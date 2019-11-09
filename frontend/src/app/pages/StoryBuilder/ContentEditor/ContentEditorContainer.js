import { connect } from "react-redux";
import { removeNode, updateStartNode } from "../duck/actions";
import ContentEditorComponent from "./ContentEditorComponent";

const mapStateToProps = (state) => ({
	selectedNode: state.story.selectedNode,
});

const mapDispatchToProps = (dispatch) => ({
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
)(ContentEditorComponent);
