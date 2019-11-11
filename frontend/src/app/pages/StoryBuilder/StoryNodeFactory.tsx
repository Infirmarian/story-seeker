import * as React from "react";
import { StoryNode } from "./StoryNode";
import { TSCustomNodeWidget } from "./StoryNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

export class TSCustomNodeFactory extends AbstractReactFactory<
	StoryNode,
	DiagramEngine
> {
	callback: (node: StoryNode) => void;
	constructor(focusFunc: (node: StoryNode) => void) {
		super("ts-custom-node");
		this.callback = focusFunc;
		console.log(focusFunc);
	}

	generateModel(initialConfig: any) {
		return new StoryNode({ text: "", engine: this.engine });
	}

	generateReactWidget(event: any): JSX.Element {
		return (
			<TSCustomNodeWidget
				engine={this.engine as DiagramEngine}
				node={event.model}
				callback={this.callback}
			/>
		);
	}
}
