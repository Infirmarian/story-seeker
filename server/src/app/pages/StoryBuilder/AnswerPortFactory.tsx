import { AnswerPort } from "./CustomPorts";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
const uuid = require("uuid/v4");

export class AnswerPortFactory extends AbstractModelFactory<
	AnswerPort,
	DiagramEngine
> {
	constructor() {
		super("answer-port");
	}

	generateModel(): AnswerPort {
		return new AnswerPort({
			answer: "",
			engine: this.engine,
			in: false,
			name: String(uuid()),
			label: String(uuid()),
		});
	}
}
