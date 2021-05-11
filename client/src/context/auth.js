import { createContext, useContext } from "react";

export const UserContext = createContext({});

export function useUser() {
	var d = new Date();
	console.log(
		"Calling useContext at ",
		d.getSeconds(),
		d.getMilliseconds(),
		useContext(UserContext),
		Object.keys(useContext(UserContext)).length
	);
	return useContext(UserContext);
}
