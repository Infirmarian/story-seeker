import { connect } from "react-redux";
import { addNode, addNodeOnDrop } from "../duck/actions";
import ToolbarComponent from "./ToolbarComponent";

const mapStateToProps = state => ({
  engine: state.story.engine,
  model: state.story.model
});

const mapDispatchToProps = dispatch => ({
  addNode: () => {
    dispatch(addNode());
  },
  addNodeOnDrop: point => {
    dispatch(addNodeOnDrop(point));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);
