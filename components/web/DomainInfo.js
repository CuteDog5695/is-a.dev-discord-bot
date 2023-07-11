async function DomainInfo(domain){
    const domains = domain.toLowerCase().replace(/\.is-a\.dev$/, "");
    const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domains}.json`, {
        headers: {
            "User-Agent": "is-a-dev-bot",
        },
    });
    if (response.status === 404) {
        return `The domain ${domain}.is-a.dev is not registered!`;
    } else {
        const data = await response.json();
        const record = data.record;
        const records = Object.entries(record).map(([type, value]) => ({ type, value }));
        const owner = data.owner;
        const json = {
            "domain": domain,
            "record": records,
            "owner": owner
        }
        return json;
    }
}

exports.DomainInfo = DomainInfo;