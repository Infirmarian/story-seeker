import { DiagramModel } from "@projectstorm/react-diagrams";
import { StoryNode } from "./StoryNode";

class StoryModel extends DiagramModel {
	serialize(): any {
		let result = {
			zoom: this.getZoomLevel(),
			offsetX: this.getOffsetX(),
			offsetY: this.getOffsetY(),
		};
		// this.getNodes().forEach((e) => {
		// 	let s = e as StoryNode;
		// 	console.log(s.serialize());
		// });
		this.getLinks().forEach((l) => {
			// TODO: Serialize this stuffz
		});
		return JSON.stringify(result);
	}

	deserializeModel(str: string) {
		let obj = JSON.parse(str);
		this.setZoomLevel(obj.zoom);
		this.setOffsetX(obj.offsetX);
		this.setOffsetY(obj.offsetY);
		console.log("Deserialized");
	}
}

export default StoryModel;
