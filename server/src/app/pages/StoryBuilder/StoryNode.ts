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
			end: this.isEnd,
			portsInOrder: this.portsIn.map((port) => {
				return port.getID();
			}),
			portsOutOrder: this.portsOut.map((port) => {
				return port.getID();
			}),
			outputPortAnswers: this.portsOut.map((port) => {
				let answerPort = port as AnswerPort;
				return answerPort.answer;
			}),
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		console.log(event);
		const {
			text,
			question,
			beginning,
			end,
			ports,
			portsInOrder,
			portsOutOrder,
			outputPortAnswers,
		} = event.data;
		this.text = text;
		this.question = question;
		this.isBeginning = beginning;
		this.isEnd = end;
		ports.forEach((port: any) => {
			console.log(port);
			if (port.in) {
				// console.log("hi");
				let portOb = (event.engine as DiagramEngine)
					.getFactoryForPort(port.type)
					.generateModel({});
				console.log(event, portOb);
				event.registerModel(portOb);
				portOb.deserialize({
					...event,
					data: port,
				});
				// port.links.forEach((link: string) => {
				// 	portOb.links[link] = this.engine.getModel().getLink(link);
				// });
				// the links need these
				console.log("portobj", portOb);
				this.addPort(portOb as DefaultPortModel);
			} else {
				let portOb = (event.engine as DiagramEngine)
					.getPortFactories()
					.getFactory("answer-port")
					.generateModel({});
				// port.links.forEach((link: string) => {
				// 	portOb.links[link] = this.engine.getModel().getLink(link);
				// });
				console.log("portobj", portOb, port.links);
				event.registerModel(portOb);
				portOb.deserialize({
					...event,
					data: port,
				});
				// the links need these
				this.addPort(portOb as AnswerPort);
			}
		});
		console.log("ports", ports);
		console.log(
			"diff port",
			ports.map((port: any) => {
				return { ...port, type: "answer-port" };
			})
		);

		this.portsIn = portsInOrder.map((id: string) => {
			return this.getPortFromID(id);
		});
		var outPorts = portsOutOrder.map((id: string, index: number) => {
			var p = this.getPortFromID(id) as AnswerPort;
			// console.log(p);
			// p.answer = outputPortAnswers[index];
			return p;
		});
		this.portsOut = outPorts;
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
		this.engine.repaintCanvas();
	}
	getQuestion(): string {
		return this.question;
	}
	setQuestion(q: string): void {
		this.question = q;
		this.engine.repaintCanvas();
	}
	setEnd(): void {
		this.setQuestion("");
		this.getOutPorts().forEach((port) => {
			this.removeOutputPort(port.getOptions().id);
		});
		this.isEnd = true;
	}
	resetEnd(): void {
		this.isEnd = false;
		this.setQuestion("...");
	}
	addOutputPort(option: string): any {
		if (this.getOutPorts().length >= 3) return false;
		const addedPort = new AnswerPort({
			answer: option,
			engine: this.engine,
			in: false,
			name: String(uuid()),
			label: String(uuid()),
		});
		this.addPort(addedPort);
		// var addedPort = this.addOutPort(option);
		this.engine.repaintCanvas();
		return addedPort.getOptions().id;
	}
	removePort(port: DefaultPortModel): void {
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port));
		} else {
			console.log(this.portsOut);
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
		console.log("final", this.getPorts());
	}
	removeOutputPort(portID: any): boolean {
		var portToRemove = this.getPortFromID(portID);
		console.log(portToRemove);
		if (portToRemove instanceof AnswerPort) {
			var links = portToRemove.getLinks();
			for (let link in links) {
				links[link].remove();
			}
			console.log("before", this.getPorts(), this.getOutPorts());
			this.removePort(portToRemove);
			console.log("after", this.getPorts(), this.getOutPorts());
			this.engine.repaintCanvas();
			return true;
		}
		return false;
	}
	updateOutputPort(portID: any, message: string): boolean {
		var portToUpdate = this.getPortFromID(portID);
		if (portToUpdate instanceof AnswerPort) {
			// console.log("node", message);
			portToUpdate.setAnswer(message);
			return true;
		}
		return false;
	}
	getInputPort(): DefaultPortModel | null {
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
			this.removePort(inputPort);
			inputPort = null;
		}
		this.isBeginning = true;
		this.isEnd = false;
	}
	clearBeginning(): void {
		this.addInPort("in");
		this.isBeginning = false;
	}
}
