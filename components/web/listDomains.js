async function ListDomains(username) {
    let results = [];

    // Assuming 'username' is defined and assigned a value

    // Assuming 'fetch' is a valid function that retrieves data from a given URL
    await fetch("https://raw-api.is-a.dev")
        .then((response) => response.json())
        .then(async (data) => {
            // Code inside the fetch promise handler
            // It receives the response and parses it as JSON data

            for (let i = 0; i < data.length; i++) {
                // Iterates over each element in the data array
                
                if (data[i].owner.username === username) {
                    // Checks if the username (case-insensitive) matches the current data record's owner
                    
                    const record = data[i].record;
                    const arr = Object.entries(record).map(([type, value]) => ({ type, value }));
                    // Extracts the record property from the current data record
                    // Converts the record object to an array of objects with 'type' and 'value' keys
                    
                    results.push({ "domain": data[i].domain,  "record": arr });
                    // Adds a new object to the results array
                    // The object contains the domain and the converted record array
                    
                    found = true;
                    // Sets a variable 'found' to true
                }
            }
        });

    return results;

}
exports.ListDomains = ListDomains;