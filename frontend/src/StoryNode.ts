import { NodeModel, PortModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { QuestionPort } from './QuestionPort';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface TSCustomNodeModelOptions extends BaseModelOptions {
    color?: string;
    text: string;
    beginning?: boolean;
}
const MIN_TEXT_LENGTH = 20;

export class StoryNode extends NodeModel {
    color: string;
    text: string;
    question: string;
    isBeginning: boolean;
    inputPort: PortModel | null;

	constructor(options: TSCustomNodeModelOptions = {text:""}) {
		super({
			...options,
			type: 'ts-custom-node'
		});
        this.color = options.color || 'red';
        this.text = options.text;
        this.question = "...?";
        this.isBeginning = options.beginning || false;

        // If not the beginning node, add an input port
        if(!this.isBeginning){
            this.inputPort = this.addPort(
                new DefaultPortModel({
                    in: true,
                    name: 'in'
                })
            );
        }else{
            this.inputPort = null;
        }
        this.addPort(
            new QuestionPort({
                in: false,
                name: 'out',
                question: 'What do you do?'
            })
        );
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.color = event.data.color;
    }
    getShortText(): string{
        return this.text.substring(0, MIN_TEXT_LENGTH)+' ...';
    }
    getFullText(): string{
        return this.text;
    }
    setFullText(nt: string): void{
        this.text = nt;
    }
    getQuestion(): string{
        return this.question;
    }
    getOutputPorts(): PortModel[]{
        var result: PortModel[] = [];
        for(var k in this.ports){
            if(this.ports[k] instanceof QuestionPort)
                result.push(this.ports[k]);
        }
        return result;
    }
    getInputPort(): PortModel | null{
        return this.inputPort;
    }
}