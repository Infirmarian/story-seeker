import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { StoryNode } from './StoryNode';

export interface TSCustomNodeWidgetProps {
	node: StoryNode;
	engine: DiagramEngine;
}

export interface TSCustomNodeWidgetState {}

export class TSCustomNodeWidget extends React.Component<TSCustomNodeWidgetProps, TSCustomNodeWidgetState> {
	constructor(props: TSCustomNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		var outputPorts = this.props.node.getOutputPorts();
		console.log(outputPorts);
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
			<div className="custom-node">
				{inelement}
				<p>{this.props.node.getShortText()}</p>
				{outputs}
			</div>
		);
	}
}