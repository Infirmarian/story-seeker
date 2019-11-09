import { NodeModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { AnswerPort, InputPort } from "./CustomPorts";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
import { thisExpression } from "@babel/types";
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

		console.log(this.engine);
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
	getShortText(): string {
		return this.text.substring(0, MIN_TEXT_LENGTH) + " ...";
	}
	getFullText(): string {
		return this.text;
	}
	setFullText(nt: string): void {
		// console.log(nt);
		this.text = nt;
	}
	getQuestion(): string {
		return this.question;
	}
	setQuestion(q: string): void {
		this.question = q;
	}
	addOutputPort(option: string): any {
		if (this.getOutputPorts().length >= 3) return false;
		var addedPort = this.addPort(
			new AnswerPort({
				answer: option,
				in: false,
				name: String(uuid()),
			})
		);
		return addedPort.getOptions().id;
	}
	removeOutputPort(portID: any): boolean {
		var portToRemove = this.getPortFromID(portID);
		if (portToRemove != null) {
			this.removePort(portToRemove);
			return true;
		}
		return false;
	}
	updateOutputPort(portID: any, message: string): boolean {
		var portToUpdate = this.getPortFromID(portID);
		if (portToUpdate instanceof AnswerPort) {
			portToUpdate.answer = message;
			return true;
		}
		return false;
	}
	getOutputPorts(): AnswerPort[] {
		var result: AnswerPort[] = [];
		for (var k in this.ports) {
			if (this.ports[k] instanceof AnswerPort)
				result.push(this.ports[k] as AnswerPort);
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
