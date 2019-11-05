import React from 'react'
import { StoryNode } from './StoryNode';

interface ToolbarProps{
    node: StoryNode;
    addNodeFunc: ()=> void;
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
        console.log(this.props.node)
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
                fulltext: this.props.node ? this.props.node.getFullText() : ""
            })
        }
    }
    saveNode(node:StoryNode){
        node.setFullText(this.state.fulltext);
    }
    render(){
        const {isBeginning, fulltext} = this.state;
        return (
            <div className = 'toolbar'>
                Toolbar
                <p onClick = {() => (this.props.addNodeFunc())}>+</p>
                <form>
                    <textarea value={fulltext}
                        onChange={(event)=>{this.recalculateState({isBeginning, fulltext: event.target.value})}}></textarea>
                    <select name="outputs">
                        <option value="0">0</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <input type='checkbox' name='beginning' defaultChecked={isBeginning}/>
                    Beginning Node
                    <input type='submit' value='Save Node'
                    onClick = {(event)=>{event.preventDefault(); this.saveNode(this.props.node);}}/>
                </form>
            </div>
        )
    }
}
export default Toolbar;