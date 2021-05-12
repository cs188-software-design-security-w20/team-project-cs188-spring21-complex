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

export async function getUser() {
	// const [user, setUser] = useState({});

	// fetch req.user from server if available, and store in context
	try {
		const response = await fetch("http://localhost:3000/checkAuthorization", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		const data = response.json();
		return data;
	} catch (err) {
		alert(err);
	}
}
