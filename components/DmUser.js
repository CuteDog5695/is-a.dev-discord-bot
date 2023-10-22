module.exports = async function (client, user, embed) {
    client.users.send(user, { embeds: [embed] });
};