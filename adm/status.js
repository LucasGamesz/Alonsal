module.exports = async function({client}){

    console.log(`Caldeiras aquecidas!`);
    console.log(`Ativo para ${client.users.cache.size} usuários em ${client.channels.cache.size} canais em ${client.guilds.cache.size} servidores diferentes!`);

    client.user.setActivity('Vapor p/ fora!', 'COMPETING')
    let activities = [
        ".ah | .ajuda",
        "Binário na fogueira",
        "Músicas no ar",
        "Mesas p/ cima",
        "Baidu premium em servidores",
        ".ah | .ajuda",
        "Código morse para o mundo",
        "Bugs infinitos no sistema",
        "Vapor p/ fora!",
        "Ceira para todo o lado"
    ]
    
    i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 5000);
}