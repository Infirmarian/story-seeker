import { storyReducer } from "./pages/StoryBuilder/duck";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
	story: storyReducer,
});
