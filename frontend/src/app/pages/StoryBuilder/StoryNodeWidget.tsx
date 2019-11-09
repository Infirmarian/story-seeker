import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { StoryNode } from './StoryNode';

export interface TSCustomNodeWidgetProps {
	node: StoryNode;
	engine: DiagramEngine;
	callback: (node: StoryNode) => void
}

export interface TSCustomNodeWidgetState {
	callback: (node: StoryNode) => void
}

export class TSCustomNodeWidget extends React.Component<TSCustomNodeWidgetProps, TSCustomNodeWidgetState> {
	constructor(props: TSCustomNodeWidgetProps) {
		super(props);
		this.state = {callback: props.callback};
	}

	render() {
		var outputPorts = this.props.node.getOutputPorts();
		const outputs = outputPorts.map((value) => 
			<PortWidget engine={this.props.engine} port={value} key={value.getID()}>
				<div className="circle-port"/>
			</PortWidget>
		);
		var input = this.props.node.getInputPort();
		let inelement;
		if(input){
			inelement = <PortWidget engine={this.props.engine} port={input} key={input.getID()}>
			<div className="circle-port"/>
		</PortWidget>;
		}else{
			inelement = null;
		}
		return (
			<div className={this.props.node.isBeginning ? 'story-header story-node' : 'story-node'}
			 onClick={() => (this.state.callback(this.props.node))}>
				{inelement}
				<p>{this.props.node.getShortText()}</p>
				{outputs}
			</div>
		);
	}
}