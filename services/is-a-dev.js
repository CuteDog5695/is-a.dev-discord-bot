const isADev = {
    "domains": ["is-a.dev"],
    "repository": "https://github.com/is-a-dev/register",
    "description": "A free domain registration service for developers.",
    "guildID": "830872854677422150",
    "record": {
        "owner": {
            "username": "${username}",
            "email": "${email}",
        },
    
        "record": {
            "${type}": "${data.toLowerCase()}",
        },
    },
    "recordtypes": ["A", "CNAME", "MX", "TXT"],

}

module.exports = { isADev }