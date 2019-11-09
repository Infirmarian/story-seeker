import { connect } from "react-redux";
import WorkspaceComponent from "./WorkspaceComponent";
import {
	updateSelectedNode,
	setEngineModel,
	registerFactory,
	initializeSelectedNode,
	initializeModel,
} from "../duck/actions";

const mapStateToProps = (state) => ({
	engine: state.story.engine,
	model: state.story.model,
	selectedNode: state.story.selectedNode,
});

const mapDispatchToProps = (dispatch) => ({
	updateSelectedNode: (node) => {
		dispatch(updateSelectedNode(node));
	},
	setEngineModel: (model) => {
		dispatch(setEngineModel(model));
	},
	registerFactory: (factory) => {
		dispatch(registerFactory(factory));
	},
	initializeSelectedNode: () => {
		dispatch(initializeSelectedNode());
	},
	initializeModel: () => {
		dispatch(initializeModel());
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WorkspaceComponent);
