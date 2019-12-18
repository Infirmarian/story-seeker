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
const uuid = require("uuid/v4");
export interface StoryNodeOptions extends BaseModelOptions {
  text: string;
  beginning?: boolean;
  id?: string;
  engine: DiagramEngine;
}
const MAX_TEXT_LENGTH = 50;
const MAX_QUESTION_LENGTH = 15;
export class StoryNode extends DefaultNodeModel {
  text: string;
  question: string | undefined;
  isBeginning: boolean;
  isEnd: boolean;
  engine: DiagramEngine;
  id?: string;

  constructor(options: StoryNodeOptions) {
    super({
      type: "ts-custom-node",
    });
    this.text = options.text;
    this.question = "...";
    this.isBeginning = options.beginning || false;
    this.isEnd = false;
    this.engine = options.engine;
    this.id = options.id;

    if (!this.isBeginning) {
      this.addInPort("in");
    }
  }

  getID(): string {
    return this.id || super.getID();
  }

  getPortIndex(targetID: string): number {
    let count = 0;
    for (const e of this.getOutPorts()) {
      if (e.getID() === targetID) {
        return count;
      }
      count++;
    }
    return -1;
  }
  // Add custom attributes to serialization process
  serializeNode() {
    return {
      x: this.position.x,
      y: this.position.y,
      id: this.getID(),
      text: this.text,
      question: this.question,
      beginning: this.isBeginning,
      end: this.isEnd,
      outputPortAnswers: this.portsOut.map((port) => {
        let answerPort = port as AnswerPort;
        return { text: answerPort.answer, id: answerPort.getID() };
      }),
    };
  }

  deserializeNode(e: any) {
    console.log(e.x);
    const { x, y, id, text, question, beginning, end, outputPortAnswers } = e;
    this.setPosition(x, y);
    this.id = id;
    this.text = text;
    this.question = question;
    this.isBeginning = beginning;
    this.isEnd = end;
    outputPortAnswers.forEach((e: any) => {
      this.addOutputPort(e.text);
    });
  }

  updateNode(): void {
    let tempPort = this.addInPort("temp");
    this.removePort(tempPort);
    this.engine.repaintCanvas();
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
    if (nt.length <= MAX_TEXT_LENGTH + 1) {
      this.updateNode();
    }
  }
  getQuestion(): string | undefined {
    return this.question;
  }
  getShortQuestion(): string | undefined {
    if (this.question !== undefined)
      return (
        this.question.substring(0, MAX_QUESTION_LENGTH) +
        (this.question.length > MAX_QUESTION_LENGTH ? "..." : "")
      );
    return this.question;
  }
  setQuestion(q: string | undefined): void {
    this.question = q;
    if (q && q.length <= MAX_QUESTION_LENGTH + 1) {
      this.updateNode();
    }
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
    console.log("Adding output port");
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

// export class StoryNode extends DefaultNodeModel {
//   text: string;
//   question: string | undefined;
//   isBeginning: boolean;
//   isEnd: boolean;
//   engine: DiagramEngine;
//   id?: string;

//   constructor(options: StoryNodeOptions) {
//     super({
//       type: "ts-custom-node",
//     });
//     this.text = options.text;
//     this.question = "";
//     this.isBeginning = options.beginning || false;
//     this.isEnd = false;
//     this.engine = options.engine;
//     this.id = options.id;

//     if (!this.isBeginning) {
//       this.addInPort("in");
//     }
//   }

//   getID(): string {
//     return this.id || super.getID();
//   }

//   getPortIndex(targetID: string): number {
//     let count = 0;
//     for (const e of this.getOutPorts()) {
//       if (e.getID() === targetID) {
//         return count;
//       }
//       count++;
//     }
//     return -1;
//   }
//   // Add custom attributes to serialization process
//   serializeNode() {
//     return {
//       x: this.position.x,
//       y: this.position.y,
//       id: this.getID(),
//       text: this.text,
//       question: this.question,
//       beginning: this.isBeginning,
//       end: this.isEnd,
//       outputPortAnswers: this.portsOut.map((port) => {
//         let answerPort = port as AnswerPort;
//         return { text: answerPort.answer, id: answerPort.getID() };
//       }),
//     };
//   }

//   deserializeNode(e: any) {
//     // console.log(e.x);
//     const { x, y, id, text, question, beginning, end, outputPortAnswers } = e;
//     this.setPosition(x, y);
//     this.id = id;
//     this.text = text;
//     this.question = question;
//     this.isBeginning = beginning;
//     this.isEnd = end;
//     this.ports = {};
//     this.portsOut = [];
//     outputPortAnswers.forEach((e: any) => {
//       this.addOutputPort(e.text);
//     });
//   }
//   updateNode(): void {
//     let tempPort = this.addInPort("temp");
//     this.removePort(tempPort);
//     this.engine.repaintCanvas();
//   }
//   getShortText(): string {
//     return (
//       this.text.substring(0, MAX_TEXT_LENGTH) +
//       (this.text.length > MAX_TEXT_LENGTH ? "..." : "")
//     );
//   }
//   getFullText(): string {
//     return this.text;
//   }
//   setFullText(nt: string): void {
//     this.text = nt;
//     if (nt.length <= MAX_TEXT_LENGTH + 1) {
//       this.updateNode();
//     }
//   }
//   getQuestion(): string | undefined {
//     return this.question;
//   }
//   getShortQuestion(): string | undefined {
//     if (this.question !== undefined)
//       return (
//         this.question.substring(0, MAX_QUESTION_LENGTH) +
//         (this.question.length > MAX_QUESTION_LENGTH ? "..." : "")
//       );
//     return this.question;
//   }
//   setQuestion(q: string | undefined): void {
//     this.question = q;
//     if (q && q.length <= MAX_QUESTION_LENGTH + 1) {
//       this.updateNode();
//     }
//   }
//   setEnd(): void {
//     this.setQuestion(undefined);
//     this.getOutPorts().forEach((port) => {
//       this.removeOutputPort(port.getOptions().id);
//     });
//     this.isEnd = true;
//   }
//   resetEnd(): void {
//     this.isEnd = false;
//     this.setQuestion("...");
//   }
//   addOutputPort(option: string): any {
//     // console.log("Adding output port");
//     if (this.getOutPorts().length >= 3) return false;
//     const addedPort = new AnswerPort({
//       answer: option,
//       engine: this.engine,
//       in: false,
//       name: String(uuid()),
//       label: String(uuid()),
//     });
//     this.addPort(addedPort);
//     // var addedPort = this.addOutPort(option);
//     this.engine.repaintCanvas();
//     return addedPort.getOptions().id;
//   }
//   removePort(port: DefaultPortModel): void {
//     if (port.getOptions().in) {
//       this.portsIn.splice(this.portsIn.indexOf(port));
//     } else {
//       // console.log(this.portsOut);
//       this.portsOut.splice(this.portsOut.indexOf(port), 1);
//     }
//     setTimeout(() => {
//       if (port && port.getName() in this.ports)
//         delete this.ports[port.getName()];
//     }, 1);
//     // console.log(this.ports);
//     // console.log("final", this.getPorts());
//   }
//   removeOutputPort(portID: string | undefined): boolean {
//     var portToRemove = this.getPortFromID(portID);
//     console.log(portToRemove);
//     if (portToRemove instanceof AnswerPort) {
//       var links = portToRemove.getLinks();
//       for (let link in links) {
//         links[link].remove();
//       }
//       // console.log("before", this.getPorts(), this.getOutPorts());
//       this.removePort(portToRemove);
//       // console.log("after", this.getPorts(), this.getOutPorts());
//       this.engine.repaintCanvas();
//       return true;
//     }
//     return false;
//   }
//   updateOutputPort(portID: any, message: string): boolean {
//     var portToUpdate = this.getPortFromID(portID);
//     if (portToUpdate instanceof AnswerPort) {
//       // console.log("node", message);
//       portToUpdate.setAnswer(message);
//       return true;
//     }
//     return false;
//   }
//   addInputPort(option: string): any {
//     if (this.getInPorts().length === 0) {
//       const inputPort = new InputPort({
//         in: true,
//         name: option,
//         label: option,
//       });
//       return this.addPort(inputPort);
//     }
//     return false;
//   }
//   getInputPort(): InputPort | DefaultPortModel | null {
//     return this.getInPorts()[0];
//   }
//   setBeginning(): void {
//     var inputPort = this.getInputPort();
//     if (inputPort) {
//       var incomingLinks = [];
//       for (var v in inputPort.getLinks()) {
//         incomingLinks.push(inputPort.getLinks()[v]);
//       }
//       incomingLinks.forEach((element) => {
//         element.remove();
//       });
//       this.removePort(inputPort);
//       inputPort = null;
//     }
//     if (this.getOutPorts().length == 0) {
//       console.log("beginning");
//       this.addOutputPort("choice 1");
//     }
//     this.isBeginning = true;
//     this.isEnd = false;
//   }
//   clearBeginning(): void {
//     this.addInPort("in");
//     this.isBeginning = false;
//   }
// }

// // Add custom attributes to serialization process
// serialize() {
//   return {
//     ...super.serialize(),
//     text: this.text,
//     question: this.question,
//     beginning: this.isBeginning,
//     portsInOrder: this.portsIn.map((port) => {
//       return port.getID();
//     }),
//     portsOutOrder: this.portsOut.map((port) => {
//       return port.getID();
//     }),
//     outputPortAnswers: this.portsOut.map((port) => {
//       const p = port as AnswerPort;
//       return p.answer;
//     }),
//   };
// }

// deserialize(event: any): void {
//   super.deserialize(event);
//   console.log(event);
//   const {
//     text,
//     question,
//     beginning,
//     portsInOrder,
//     portsOutOrder,
//     outputPortAnswers,
//   } = event.data;
//   this.text = text;
//   this.question = question;
//   this.isBeginning = beginning;
//   this.portsIn = portsInOrder.map((id: string) => {
//     return this.getPortFromID(id);
//   });
//   var outPorts = portsOutOrder.map((id: string, index: number) => {
//     var p = this.getPortFromID(id) as AnswerPort;
//     p.answer = outputPortAnswers[index];
//     return p;
//   });
//   this.portsOut = outPorts;
// }

// getShortText(): string {
//   return (
//     this.text.substring(0, MAX_TEXT_LENGTH) +
//     (this.text.length > MAX_TEXT_LENGTH ? "..." : "")
//   );
// }
// getFullText(): string {
//   return this.text;
// }
// setFullText(nt: string): void {
//   this.text = nt;
//   this.engine.repaintCanvas();
// }
// getQuestion(): string {
//   return this.question;
// }
// setQuestion(q: string): void {
//   this.question = q;
//   this.engine.repaintCanvas();
// }
// setEnd(): void {
//   this.setQuestion("");
//   this.getOutPorts().forEach((port) => {
//     this.removeOutputPort(port.getOptions().id);
//   });
//   this.isEnd = true;
// }
// resetEnd(): void {
//   this.isEnd = false;
//   this.setQuestion("...");
// }
// addOutputPort(option: string): any {
//   if (this.getOutPorts().length >= 3) return false;
//   const addedPort = new AnswerPort({
//     answer: option,
//     engine: this.engine,
//     in: false,
//     name: String(uuid()),
//     label: String(uuid()),
//   });
//   this.addPort(addedPort);
//   // var addedPort = this.addOutPort(option);
//   this.engine.repaintCanvas();
//   return addedPort.getOptions().id;
// }
// removePort(port: DefaultPortModel): void {
//   if (port.getOptions().in) {
//     this.portsIn.splice(this.portsIn.indexOf(port));
//   } else {
//     console.log(this.portsOut);
//     this.portsOut.splice(this.portsOut.indexOf(port), 1);
//   }
//   console.log("final", this.getPorts());
// }
// removeOutputPort(portID: any): boolean {
//   var portToRemove = this.getPortFromID(portID);
//   console.log(portToRemove);
//   if (portToRemove instanceof AnswerPort) {
//     var links = portToRemove.getLinks();
//     for (let link in links) {
//       links[link].remove();
//     }
//     console.log("before", this.getPorts(), this.getOutPorts());
//     this.removePort(portToRemove);
//     console.log("after", this.getPorts(), this.getOutPorts());
//     this.engine.repaintCanvas();
//     return true;
//   }
//   return false;
// }
// updateOutputPort(portID: any, message: string): boolean {
//   var portToUpdate = this.getPortFromID(portID);
//   if (portToUpdate instanceof AnswerPort) {
//     // console.log("node", message);
//     portToUpdate.setAnswer(message);
//     return true;
//   }
//   return false;
// }
// getInputPort(): InputPort | null {
//   return this.getInPorts()[0];
// }
// setBeginning(): void {
//   var inputPort = this.getInputPort();
//   if (inputPort) {
//     var incomingLinks = [];
//     for (var v in inputPort.getLinks()) {
//       incomingLinks.push(inputPort.getLinks()[v]);
//     }
//     incomingLinks.forEach((element) => {
//       element.remove();
//     });
//     this.removePort(inputPort);
//     inputPort = null;
//   }
//   this.isBeginning = true;
//   this.isEnd = false;
// }
// clearBeginning(): void {
//   this.addInPort("in");
//   this.isBeginning = false;
// }
