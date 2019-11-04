//QuestionPort
import {DefaultPortModel, DefaultPortModelOptions} from '@projectstorm/react-diagrams';
interface QuestionPortOptions extends DefaultPortModelOptions{
    question: string
}
export class QuestionPort extends DefaultPortModel{
    question: string;
    constructor(options: QuestionPortOptions){
        super(options);
        this.question = options.question;
    }
}