import React from "react";
const url = 'http://localhost:5000/api/'
interface AllStoriesState {
    loaded: boolean,
    content: Array<JSON> | null
};
class AllStories extends React.Component<{}, AllStoriesState> {
    constructor(props: any){
        super(props);
        this.state = {
            loaded: false,
            content: null
        };
    }
    componentDidMount(){
        fetch(url+'get_all_stories').then((response) => {
            console.log(response);
            response.json().then((value) => {
                this.setState({loaded: true, content: value.stories})
            }).catch((error) => console.error(error));
        }).catch((error) =>{
            console.error(error);
        });
    }

    render(){
        if(! this.state.loaded)
            return (<div>All Story Page (Loading...)</div>);
        return (<div>Successfully loaded!</div>);
    }
}

export default AllStories;