async function ListDomains(username) {
    let results = [];
    await fetch("https://raw-api.is-a.dev")
            .then((response) => response.json())
            .then(async (data) => {
                

                for (let i = 0; i < data.length; i++) {
                    if (data[i].owner.username.toLowerCase() === username.toLowerCase()) {
                        // push the domain record to the results array but remove email and note from the record
                        // convert data[i].record} to an array
                        const record = data[i].record;
                        const arr = Object.entries(record)[0];
                    
                        
                        results.push({ "domain": data[i].domain, "record": arr});
                        // add the domain to the results array
                        //results.push(data[i].domain);
                        // set found to true
                        found = true;
                    }
                }
            });
    return results;
}
exports.ListDomains = ListDomains;