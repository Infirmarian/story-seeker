//AnswerPort
import {
	DefaultPortModel,
	DefaultPortModelOptions,
	PortModel,
	LinkModel,
	DefaultLinkModel,
	DiagramEngine,
} from "@projectstorm/react-diagrams";
interface AnswerPortOptions extends DefaultPortModelOptions {
	answer: string;
	engine: DiagramEngine;
}
export class AnswerPort extends DefaultPortModel {
	answer: string;
	engine: DiagramEngine;
	constructor(options: AnswerPortOptions) {
		super(options);
		this.answer = options.answer;
		this.engine = options.engine;
		this.setMaximumLinks(1);
	}
	setAnswer(answer: string): void {
		console.log("port", answer);
		this.answer = answer;
		this.engine.repaintCanvas();
	}
	canLinkToPort(port: PortModel): boolean {
		if (port instanceof InputPort) {
			return true;
		}
		if (port instanceof AnswerPort) return false;
		return false;
	}
	createLinkModel(): LinkModel {
		var vs = Object.values(this.links);
		if (vs.length > 0) {
			vs[0].remove();
		}
		const lm = new DefaultLinkModel();
		return lm;
	}
}
export class InputPort extends DefaultPortModel {
	canLinkToPort(port: PortModel): boolean {
		console.log("Linking to InputPort");
		if (port instanceof AnswerPort) {
			if (Object.values(port.links).length > 0) return false;
			return true;
		}
		return false;
	}
	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
