import {
	NodeModel,
	DiagramEngine,
	DefaultLinkModel,
	DefaultPortModel,
	DefaultNodeModel,
	PortModel,
} from "@projectstorm/react-diagrams";
import { AnswerPort, InputPort } from "./CustomPorts";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
import { thisExpression } from "@babel/types";
const uuid = require("uuid/v4");
export interface StoryNodeOptions extends BaseModelOptions {
	text: string;
	beginning?: boolean;
	engine: DiagramEngine;
}
const MAX_TEXT_LENGTH = 50;

export class StoryNode extends DefaultNodeModel {
	text: string;
	question: string;
	isBeginning: boolean;
	isEnd: boolean;
	engine: DiagramEngine;

	constructor(options: StoryNodeOptions) {
		super({
			type: "ts-custom-node",
		});
		this.text = options.text;
		this.question = "...";
		this.isBeginning = options.beginning || false;
		this.isEnd = false;
		this.engine = options.engine;

		if (!this.isBeginning) {
			this.addInPort("in");
		}
	}

	// Add custom attributes to serialization process
	serialize() {
		return {
			...super.serialize(),
			text: this.text,
			question: this.question,
			beginning: this.isBeginning,
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		console.log(event);
		const { text, question, beginning } = event.data;
		this.text = text;
		this.question = question;
		this.isBeginning = beginning;
	}

	getShortText(): string {
		return (
			this.text.substring(0, MAX_TEXT_LENGTH) +
			(this.text.length > MAX_TEXT_LENGTH ? "..." : "")
		);
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
	setQuestion(q: string): void {
		this.question = q;
	}
	// setEnd(): void {
	// 	this.setQuestion("");
	// 	this.getOutPorts().forEach((port) => {
	// 		this.removeOutputPort(port.getOptions().id);
	// 	});
	// }
	resetEnd(): void {
		this.isEnd = false;
		this.setQuestion("...?");
	}
	addOutputPort(option: string): any {
		if (this.getOutPorts().length >= 3) return false;
		var addedPort = this.addOutPort(option);
		this.engine.repaintCanvas();
		return addedPort.getOptions().id;
	}
	removeOutputPort(portID: any): boolean {
		var portToRemove = this.getPortFromID(portID);
		if (portToRemove != null) {
			var links = portToRemove.getLinks();
			for (let link in links) {
				links[link].remove();
			}
			portToRemove.remove();
			// this.removePort(portToRemove);
			this.engine.repaintCanvas();
			return true;
		}
		return false;
	}
	// updateOutputPort(portID: any, message: string): boolean {
	// 	var portToUpdate = this.getPortFromID(portID);
	// 	if (portToUpdate instanceof AnswerPort) {
	// 		console.log("node", message);
	// 		portToUpdate.setAnswer(message);
	// 		return true;
	// 	}
	// 	return false;
	// }
	getOutputPorts(): AnswerPort[] {
		var result: AnswerPort[] = [];
		for (var k in this.ports) {
			if (this.ports[k] instanceof AnswerPort)
				result.push(this.ports[k] as AnswerPort);
		}
		return result;
		// this.engine.getCanvas().
	}
	getInputPort(): InputPort | null {
		return this.getInPorts()[0];
	}
	setBeginning(): void {
		var inputPort = this.getInputPort();
		if (inputPort) {
			var incomingLinks = [];
			for (var v in inputPort.getLinks()) {
				incomingLinks.push(inputPort.getLinks()[v]);
			}
			incomingLinks.forEach((element) => {
				element.remove();
			});
			inputPort.remove();
			inputPort = null;
		}
		this.isBeginning = true;
	}
	clearBeginning(): void {
		this.addInPort("in");
		this.isBeginning = false;
	}
}

/* export class StoryNode extends NodeModel {
	text: string;
	question: string;
	isBeginning: boolean;
	isEnd: boolean;
	inputPort: InputPort | null;
	engine: DiagramEngine;

	constructor(options: StoryNodeOptions) {
		super({
			type: "ts-custom-node",
		});
		this.text = options.text;
		this.question = "...?";
		this.isBeginning = options.beginning || false;
		this.isEnd = false;
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
			inputPort: this.inputPort,
			question: this.question,
			text: this.text,
			isBeginning: this.isBeginning,
			isEnd: this.isEnd,
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		console.log(event);
		const {
			ports,
			inputPort,
			question,
			text,
			isBeginning,
			isEnd,
		} = event.data;
		console.log(ports);
		var formattedPorts: { [s: string]: DefaultPortModel } = {};
		ports.forEach((port: any) => {
			const id: string = port.id;
			delete port.id;
			formattedPorts[id] = port;
		});
		// this.ports = formattedPorts;
		this.inputPort = inputPort;
		this.question = question;
		this.text = text;
		this.isBeginning = isBeginning;
		this.isEnd = isEnd;
	}

	repaint(): void {
		setTimeout(() => {
			this.engine.repaintCanvas();
		}, 500);
	}
	getShortText(): string {
		return (
			this.text.substring(0, MAX_TEXT_LENGTH) +
			(this.text.length > MAX_TEXT_LENGTH ? "..." : "")
		);
	}
	getFullText(): string {
		return this.text;
	}
	setFullText(nt: string): void {
		this.text = nt;
		this.repaint();
	}
	getQuestion(): string {
		return this.question;
	}
	setQuestion(q: string): void {
		this.question = q;
		this.repaint();
	}
	setEnd(): void {
		this.isEnd = true;
		this.setQuestion("");
		this.getOutputPorts().forEach((port) => {
			this.removeOutputPort(port.getOptions().id);
		});
	}
	resetEnd(): void {
		this.isEnd = false;
		this.setQuestion("...?");
	}
	addOutputPort(option: string): any {
		if (this.getOutputPorts().length >= 3) return false;
		var addedPort = this.addPort(
			new AnswerPort({
				answer: option,
				engine: this.engine,
				in: false,
				name: String(uuid()),
			})
		);
		this.engine.repaintCanvas();
		return addedPort.getOptions().id;
	}
	removeOutputPort(portID: any): boolean {
		var portToRemove = this.getPortFromID(portID);
		if (portToRemove != null) {
			var links = portToRemove.getLinks();
			for (let link in links) {
				links[link].remove();
			}
			this.removePort(portToRemove);
			this.engine.repaintCanvas();
			return true;
		}
		return false;
	}
	updateOutputPort(portID: any, message: string): boolean {
		var portToUpdate = this.getPortFromID(portID);
		if (portToUpdate instanceof AnswerPort) {
			console.log("node", message);
			portToUpdate.setAnswer(message);
			this.repaint();
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
		// this.engine.getCanvas().
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
		this.repaint();
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
 */
