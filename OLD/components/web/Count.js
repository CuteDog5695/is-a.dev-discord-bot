async function CountDomains() {
    try {
        const response = await fetch("https://raw-api.is-a.dev");
        const data = await response.json();
        const results = countDomainsAndOwners(data);
        return results;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

function countDomainsAndOwners(jsonData) {
    const parsedData = jsonData;
    const subdomains = parsedData.length;
    const owners = new Set();

    parsedData.forEach((entry) => {
        if (entry.owner) {
            owners.add(JSON.stringify(entry.owner));
        }
    });

    const individualOwners = owners.size;

    return {
        subdomains,
        individualOwners,
    };
}

exports.CountDomains = CountDomains;
