async function CheckDomain(subdomain) {
    // check if domain is available
    let response = null
     response = await fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`, {
        headers: {
            "User-Agent": "is-a-dev-bot",
        },
    });
    console.log(response.status);
    if (response.status === 200) {
        const json = { "status": "unavalible" };
        return json;
    }
    else {
        const json = { "status": "available" };
        return json;
    }
}

exports.CheckDomain = CheckDomain;