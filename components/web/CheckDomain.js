async function CheckDomain(domain) {
    // check if domain is available
    const subdomain = domain.replace(/\.is-a\.dev$/, "");
    const response = await fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`, {
        headers: {
            "User-Agent": "is-a-dev-bot",
        },
    });
    if (response.status === 404) {
        const json = { "status": "available" };
        return json;
    }
    else {
        const json = { "status": "unavalible" };
        return json;
    }
}

exports.CheckDomain = CheckDomain;