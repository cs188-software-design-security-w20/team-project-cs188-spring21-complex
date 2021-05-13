function getCsrfToken(req) {
	let cookies = req.headers.cookie.split(";").reduce((res, item) => {
		const data = item.trim().split("=");
		return { ...res, [data[0]]: data[1] };
	}, {});
	return cookies["XSRF-TOKEN"];
}

module.exports.getCsrfToken = getCsrfToken;
