const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user
    let texto = "", removidos = [], adicionados = []
    let old_member = dados[0], new_member = dados[1]

    if (registroAudita.changes[0].key === "$add")
        registroAudita.changes[0].new.forEach(role => {
            adicionados.push(`<@&${role.id}>`)
        })
    else
        registroAudita.changes[0].new.forEach(role => {
            removidos.push(`<@&${role.id}>`)
        })

    if (adicionados.length > 0)
        texto += `\n**:sparkle: ${client.tls.phrase(guild, "mode.logger.cargo_adicionado")}:** ${adicionados.join(", ")}`

    if (removidos.length > 0)
        texto += `\n**:no_entry_sign: ${client.tls.phrase(guild, "mode.logger.cargo_removido")}:** ${removidos.join(", ")}`

    // Membros não salvos no cache
    if (adicionados.length > 1 || removidos.length > 1 || old_member.roles.cache.size == 0 || texto.length < 1)
        return

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.cargo_atualizado"))
        .setColor(0x29BB8E)
        .setDescription(texto)
        .setFields(
            {
                name: client.user_title(user_alvo, guild),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: client.user_title(registroAudita.executor, guild),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )
        .setTimestamp()

    // Comparando as permissões adicionadas e removidas
    const alteracoes = comparar_diferencas(old_member.permissions.toArray(), new_member.permissions.toArray())

    // Listando as permissões do usuário
    embed.addFields(
        {
            name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
            value: `<t:${parseInt(new_member.joinedTimestamp / 1000)}:F>\n( <t:${Math.floor(new_member.joinedTimestamp / 1000)}:R> )`,
            inline: false
        },
        {
            name: `:shield: **${client.tls.phrase(guild, "mode.logger.permissoes_apos")}**`,
            value: alteracoes.adicoes.length > 0 || alteracoes.remocoes.length > 0 ? `${alteracoes.adicoes.length > 0 ? `**🌟 Adicionado:**\n${client.list(alteracoes.adicoes, 2000)}\n` : ""}${alteracoes.remocoes.length > 0 ? `**\n❌ Removido:**\n${client.list(alteracoes.remocoes, 2000)}` : ""}` : "`❌ Não há permissões diferentes vinculados neste cargo`",
            inline: false
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}

function comparar_diferencas(antigo, novo) {

    const obj = {
        adicoes: [],
        remocoes: []
    }

    // Comparando as adições e remoções ao atribuir/remover cargos
    for (let i = 0; i < antigo.length; i++)
        for (let x = 0; x < novo.length; x++) {

            if (!antigo.includes(novo[x]) && !obj.adicoes.includes(novo[x]) && novo[x])
                obj.adicoes.push(novo[x])
            else if (!novo.includes(antigo[x]) && !obj.remocoes.includes(antigo[x]) && antigo[x])
                obj.remocoes.push(antigo[x])
        }

    return obj
}