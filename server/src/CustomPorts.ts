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
		if (port instanceof InputPort) {
			return true;
        }
        if(port instanceof QuestionPort) return false;
		return false;
    }
    createLinkModel(): LinkModel{
        var vs = Object.values(this.links);
        if (vs.length > 0) {
            vs[0].remove();
        }
        const lm = new DefaultLinkModel();
        return lm
    }
}
export class InputPort extends DefaultPortModel{
    canLinkToPort(port: PortModel): boolean{
        console.log('Linking to InputPort');
        if(port instanceof QuestionPort){
            if(Object.values(port.links).length > 0) return false;
            return true;
        }
        return false;
    }
    createLinkModel(): LinkModel{
        return new DefaultLinkModel();
    }
}