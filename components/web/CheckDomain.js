function CheckDomain(domain) {
    // check if domain is available
    let found = false;
    fetch("https://raw-api.is-a.dev")
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].domain === domain) {
                    found = true;
                }
            }
        }
        );
        if (found) {
            return true;
        }
        else {
            return false;
        }
}

exports.CheckDomain = CheckDomain;