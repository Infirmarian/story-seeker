import * as React from 'react';
import { StoryNode } from './StoryNode';
import { TSCustomNodeWidget } from './StoryNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class TSCustomNodeFactory extends AbstractReactFactory<StoryNode, DiagramEngine> {
	constructor() {
		super('ts-custom-node');
	}

	generateModel(initialConfig: any) {
		return new StoryNode();
	}

	generateReactWidget(event: any): JSX.Element {
		return <TSCustomNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}