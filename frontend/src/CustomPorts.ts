//QuestionPort
import {DefaultPortModel, DefaultPortModelOptions, PortModel, LinkModel, DefaultLinkModel} from '@projectstorm/react-diagrams';
interface QuestionPortOptions extends DefaultPortModelOptions{
    question: string
}
export class QuestionPort extends DefaultPortModel{
    question: string;
    constructor(options: QuestionPortOptions){
        super(options);
        this.question = options.question;
        this.setMaximumLinks(1);
    }
    canLinkToPort(port: PortModel): boolean {
        if(Object.keys(this.links).length > 0) return false;
		if (port instanceof DefaultPortModel) {
			return this.options.in !== port.getOptions().in;
        }
        if(port instanceof QuestionPort) return false;
		return true;
    }
    createLinkModel(): LinkModel{
        // TODO
        const lm = new DefaultLinkModel();
        return lm
    }
}
export class InputPort extends DefaultPortModel{
    canLinkToPort(port: PortModel): boolean{
        return false;
    }
}