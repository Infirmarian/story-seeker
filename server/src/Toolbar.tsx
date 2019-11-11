import React from 'react'
import { StoryNode } from './StoryNode';

interface ToolbarProps{
    node: StoryNode;
    addNodeFunc: ()=> void;
    setBeginning: (ns: StoryNode)=>void;
}
interface ToolbarState{
    fulltext: string;
    isBeginning: boolean;
}

class Toolbar extends React.Component<ToolbarProps, ToolbarState>{
    constructor(props: ToolbarProps){
        super(props);
        this.state = {
            fulltext: "",
            isBeginning: false
        };
    }
    recalculateState(ns: ToolbarState){
        if(ns.fulltext){
            this.setState(ns);
        }else{
            this.setState({
                fulltext: "",
                isBeginning: false
            })
        }
    }
    componentDidUpdate(prevProps: ToolbarProps, prevState: ToolbarState){
        if(prevProps.node !== this.props.node){
            this.setState({
                fulltext: this.props.node ? this.props.node.getFullText() : "",
                isBeginning: this.props.node ? this.props.node.isBeginning : false
            })
        }
    }
    saveNode(node:StoryNode){
        node.setFullText(this.state.fulltext);
    }
    render(){
        const {isBeginning, fulltext} = this.state;
        const {node} = this.props;
        if(!node){
            return (
                <div className = 'toolbar'></div>
            )
        }
        return (
            <div className = 'toolbar'>
                Toolbar
                <p onClick = {() => (this.props.addNodeFunc())}>+</p>
                <form>
                    <textarea value={fulltext}
                        onChange={(event)=>{this.recalculateState({isBeginning, fulltext: event.target.value})}}></textarea>
                    <input type='checkbox' name='beginning' checked={isBeginning} readOnly/>
                    Beginning Node
                    <input type='button' name='make beginning' value='make beginning'
                    onClick={()=>{this.props.setBeginning(node)}}/>
                    <input type='submit' value='Save Node'
                    onClick = {(event)=>{event.preventDefault(); this.saveNode(node);}}/>
                </form>
                <button className={'append-button button ' + (node.getOutputPorts().length < 3 ? 'append-button-enabled' : '')} 
                onClick={()=>{node.addOutputPort('hello world?')}}>Add Question</button>
            </div>
        )
    }
}
export default Toolbar;