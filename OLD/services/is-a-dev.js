const isADev = {
    domains: ["is-a.dev"],
    name: "is-a.dev",
    github: "is-a-dev",
    repository: "register",
    logo: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
    description: "A free domain registration service for developers.",
    guildID: "830872854677422150",
    record: {
        owner: {
            username: "${username}",
            email: "${email}",
        },

        record: {
            "${type}": "${data.toLowerCase()}",
        },
    },
    recordtypes: ["A", "CNAME", "MX", "TXT"],
};

module.exports = { isADev };
