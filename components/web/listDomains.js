async function ListDomains(username) {
    let results = [];
    await fetch("https://raw-api.is-a.dev")
            .then((response) => response.json())
            .then(async (data) => {
                

                for (let i = 0; i < data.length; i++) {
                    if (data[i].owner.username.toLowerCase() === username.toLowerCase()) {
                        results.push(data[i].domain);
                        found = true;
                    }
                }
            });
    return results;
}
exports.ListDomains = ListDomains;