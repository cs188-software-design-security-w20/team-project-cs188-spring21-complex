import { createContext, useContext } from "react";
import { domain } from "../routes";

export const UserContext = createContext({});

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function genCsrfToken() {
    let buf = require('crypto').randomBytes(48);
    let token = buf.toString('hex');
    
    console.log(token);
    setCookie('XSRF-TOKEN', token, 0.1)
    return token;
}

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
		const response = await fetch(`${domain}/checkAuthorization`, {
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
