async function CheckDomain(subdomain) {
    // check if domain is available
    let response = null
     response = await fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`, {
        headers: {
            "User-Agent": "is-a-dev",
        },
    });
    console.log(response.status);
    if (response.status === 200) {
        const jsonu = { "status": "unavalible" };
        return jsonu;
    }
    else {
        const jsonp = { "status": "available" };
        return jsonp;
    }
}

exports.CheckDomain = CheckDomain;