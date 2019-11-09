import { connect } from "react-redux";
import {
	addNode,
	removeNode,
	updateStartNode,
	updateNodeContent,
} from "../duck/actions";
import ToolbarComponent from "./ToolbarComponent";

const mapStateToProps = (state) => ({
	selectedNode: state.story.selectedNode,
	nodeContent: state.story.nodeContent,
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
	updateNodeContent: (text) => {
		dispatch(updateNodeContent(text));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ToolbarComponent);
