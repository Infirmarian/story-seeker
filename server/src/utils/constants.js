var defURL;
defURL = "https://www.storyseeker.fun";
if (process.env.REACT_APP_SERVER_STATE === "DEVELOPMENT") {
	defURL = "http://localhost:5000";
}
console.log(process.env.REACT_APP_SERVER_STATE);
export const URL = defURL;
