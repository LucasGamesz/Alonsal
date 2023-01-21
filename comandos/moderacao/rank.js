const { existsSync, writeFileSync } = require('fs')
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription("⌠💂⌡ Adjust some user's XP")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Ajuste o XP de algum usuário',
            "es-ES": '⌠💂⌡ Ajustar la XP de algunos usuarios',
            "fr": '⌠💂⌡ Ajustez XP pour certains utilisateurs',
            "it": '⌠💂⌡ Regola gli XP di un altro utente'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "it": 'utente'
                })
                .setDescription("The user to adjust")
                .setDescriptionLocalizations({
                    "pt-BR": 'O usuário a ser ajustado',
                    "es-ES": 'El usuario para ajustar',
                    "fr": 'Utilisateur cible',
                    "it": 'L\'utente da aggiornare'
                })
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('xp')
                .setDescription('What is the new XP?')
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual o novo XP?',
                    "es-ES": '¿Qué es el nuevo XP?',
                    "fr": 'Qu\'est-ce que le nouvel XP?',
                    "it": 'Qual è il nuovo XP?'
                })
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== client.owners[0])
            return client.tls.reply(client, interaction, "mode.adm.moderadores", true)

        const usuario = interaction.options.getUser('user')

        const user = {
            id: usuario.id,
            nickname: usuario.username,
            lastValidMessage: 0,
            warns: 0,
            caldeira_de_ceira: false,
            xp: 0
        }

        if (existsSync(`./arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)) {
            delete require.cache[require.resolve(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)]
            const { xp, lastValidMessage, warns, caldeira_de_ceira } = require(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)
            user.xp = xp
            user.warns = warns
            user.lastValidMessage = lastValidMessage
            user.caldeira_de_ceira = caldeira_de_ceira
        }

        let novo_exp = parseFloat(interaction.options.get('xp').value)

        user.xp = parseFloat(novo_exp)
        novo_nivel = parseFloat(novo_exp / 1000)

        try {
            writeFileSync(`./arquivos/data/rank/${interaction.guild.id}/${user.id}.json`, JSON.stringify(user))
            delete require.cache[require.resolve(`../../arquivos/data/rank/${interaction.guild.id}/${user.id}.json`)]
        } catch (err) {
            console.log(err)
            return client.tls.reply(client, interaction, "mode.xp.error_2", true, 0)
        }

        interaction.reply({ content: `:military_medal: | ${client.tls.phrase(client, interaction, "mode.xp.sucesso", true, 0).replace("nick_repl", user.nickname).replace("exp_repl", novo_exp.toFixed(2)).replace("nivel_repl", novo_nivel.toFixed(2))}`, ephemeral: true })
    }
}