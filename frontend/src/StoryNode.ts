import { NodeModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { QuestionPort, InputPort } from "./CustomPorts";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
const uuid = require("uuid/v4");
export interface StoryNodeOptions extends BaseModelOptions {
	color?: string;
	text: string;
	beginning?: boolean;
	engine: DiagramEngine;
}
const MIN_TEXT_LENGTH = 20;

export class StoryNode extends NodeModel {
	color: string;
	text: string;
	question: string;
	isBeginning: boolean;
	inputPort: InputPort | null;
	engine: DiagramEngine;

	constructor(options: StoryNodeOptions) {
		super({
			...options,
			type: "ts-custom-node",
		});
		this.color = options.color || "red";
		this.text = options.text;
		this.question = "...?";
		this.isBeginning = options.beginning || false;
		this.engine = options.engine;

		// If not the beginning node, add an input port
		if (!this.isBeginning) {
			this.inputPort = this.addPort(
				new InputPort({
					in: true,
					name: "in",
				})
			) as InputPort;
		} else {
			this.inputPort = null;
		}
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color,
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.color = event.data.color;
	}
	addOutputPort(option: string): boolean {
		if (this.getOutputPorts().length >= 3) return false;
		this.addPort(
			new QuestionPort({
				question: option,
				in: false,
				name: String(uuid()),
			})
		);
		return true;
	}
	getShortText(): string {
		return this.text.substring(0, MIN_TEXT_LENGTH) + " ...";
	}
	getFullText(): string {
		return this.text;
	}
	setFullText(nt: string): void {
		this.text = nt;
	}
	getQuestion(): string {
		return this.question;
	}
	getOutputPorts(): QuestionPort[] {
		var result: QuestionPort[] = [];
		for (var k in this.ports) {
			if (this.ports[k] instanceof QuestionPort)
				result.push(this.ports[k] as QuestionPort);
		}
		return result;
	}
	getInputPort(): InputPort | null {
		return this.inputPort;
	}
	setBeginning(): void {
		if (this.inputPort) {
			var incomingLinks = [];
			for (var v in this.inputPort.getLinks()) {
				incomingLinks.push(this.inputPort.getLinks()[v]);
			}
			incomingLinks.forEach((element) => {
				element.remove();
			});
			this.inputPort.remove();
			this.inputPort = null;
		}
		this.isBeginning = true;
	}
	clearBeginning(): void {
		this.inputPort = this.addPort(
			new InputPort({
				in: true,
				name: "in",
			})
		) as InputPort;
		this.isBeginning = false;
	}
}
