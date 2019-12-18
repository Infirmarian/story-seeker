import {
	DefaultPortModel,
	DefaultPortModelOptions,
	PortModel,
	LinkModel,
	DefaultLinkModel,
	DiagramEngine,
} from "@projectstorm/react-diagrams";
import { CustomLinkModel } from "./CustomLinks";
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

	serialize() {
		return {
			...super.serialize(),
			answer: this.answer,
		};
	}
	deserialize(event: any) {
		super.deserialize(event);
		this.answer = event.data.answer;
	}

	setAnswer(answer: string): void {
		this.answer = answer;
		this.engine.repaintCanvas();
	}
	canLinkToPort(port: PortModel): boolean {
		if (port instanceof AnswerPort) return false;
		return true;
	}
	createLinkModel(): LinkModel {
		var vs = Object.values(this.links);
		if (vs.length > 0) {
			vs[0].remove();
		}
		const lm = new CustomLinkModel();
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
