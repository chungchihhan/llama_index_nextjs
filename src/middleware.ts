//this file should be under src folder

export { default } from "next-auth/middleware";

//add path that you want to include in the middleware
export const config = { matcher: ["/MainPage"] };
