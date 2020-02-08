var defURL;
defURL = "https://www.storyseeker.fun";
if (process.env.SERVER_STATE === "DEVELOPMENT") {
  defURL = "http://localhost:5000";
}
export const URL = defURL;
