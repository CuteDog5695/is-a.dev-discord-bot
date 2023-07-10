async function CountDomains() {
  await fetch("https://raw-api.is-a.dev")
    .then((response) => response.json())
    .then(async (data) => {
        let count = 0;
        // count the number of domains in the json response
        for (let i = 0; i < data.length; i++) {
            count++;
        }
        // count the number of users in the json response
        let users = [];
        for (let i = 0; i < data.length; i++) {
            users.push(data[i].owner.username);
        }
        // count the number of unique users
        let uniqueUsers = [...new Set(users)];
        // count the number of domains that are forked
        return { "subdomains": count, "individual_owners": uniqueUsers.length };
    }
    );
}
exports.CountDomains = CountDomains;