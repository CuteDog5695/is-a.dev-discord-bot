async function CheckDomain(subdomain) {
    // check if domain is available
    let result = false;
    await fetch("https://raw-api.is-a.dev")
        .then((response) => response.json())
        .then(async (data) => {
            result = data.some((item) => item.domain === subdomain);
            if (result) {
                const da = { domain: subdomain, available: false };
                return da;
            } else {
                const db = { domain: subdomain, available: true };
                return db;
            }
        });
}

exports.CheckDomain = CheckDomain;
