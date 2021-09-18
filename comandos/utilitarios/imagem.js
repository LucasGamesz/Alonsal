module.exports = {
    name: "imagem",
    description: "Edite imagens através de comandos",
    aliases: [ "img", "edit", "dit", "i", "ih" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
  
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const Discord = require('discord.js');
        const Canvas = require('canvas');
        
        const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_carregando = client.emojis.cache.get(emojis.loading2).toString();
        let emoji_dancante = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        if(message.content == ".aih"){ // Menu de efeitos

            const embed_imagens = new Discord.MessageEmbed()
            .setTitle(utilitarios[7]["manipu_imagens"])
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(utilitarios[7]["conteudo_menu"] +"\n\n"+ emoji_dancante +""+ utilitarios[7]["sugestao"])
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            
            return message.lineReply(embed_imagens);
        }

        if(args.length < 1) // Sem o estilo informado
            return message.lineReply(":warning: | "+ utilitarios[7]["aviso_1"]);

        if(message.attachments.size < 1) // Nenhum arquivo anexado
            return message.lineReply(":warning: | "+ utilitarios[7]["aviso_2"]);

        if(message.attachments.size > 3) // Quantidade > 3
            return message.lineReply(":octagonal_sign: | "+ utilitarios[7]["aviso_3"]);

        const feedbc = await message.lineReply(emoji_carregando +" | "+ utilitarios[7]["carregando"]);
        let img_edit = 0;

        message.attachments.forEach(async attachment => {
            url = attachment.url;
            height = attachment.height;
            width = attachment.width;
                        
            if(!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg") && !url.includes(".bmp")){ // Extensão de arquivo incorreta
                const arquivo_invalido = new Discord.MessageAttachment(url);

                let infos_adds = "";
                if(message.attachments.size > 1)
                    infos_adds = utilitarios[7]["error_1"];

                return message.lineReply(":octagonal_sign: | "+ utilitarios[7]["error_2"] +""+ infos_adds, arquivo_invalido); 
            }

            if(height > 4500 || width > 4500) // Verificando se a imagem possui muitos pixeis
                return message.lineReply(":octagonal_sign: | "+ utilitarios[7]["aviso_4"]);

            if(height >= 4000 && width == 1894){ // Verificando se a imagem é muito grande e se existem vários arquivos
                if(message.attachments.size > 1) // Muitos arquivos enviados
                    return message.lineReply(":octagonal_sign: | "+ utilitarios[7]["aviso_5"]);

                let inverte = width;
                width = height;
                height = inverte;
            }

            // Criando o canvas e desenhando a imagem recebida nele
            const canvas = Canvas.createCanvas(width, height);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage(url);

            if(args[0] == "bw"){ // Filtro de Branco e Preto

                context.drawImage(background, 0, 0, canvas.width, canvas.height);

                let imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
                let pixels = imgData.data;
                
                for (var i = 0; i < pixels.length; i += 4) {
                    let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

                    pixels[i] = lightness;
                    pixels[i + 1] = lightness;
                    pixels[i + 2] = lightness;
                }

                context.putImageData(imgData, 0, 0);

                const imagem_editada = new Discord.MessageAttachment(canvas.toBuffer(), 'new_image.png');

                message.lineReply('', imagem_editada);
                img_edit++;

                if(img_edit == message.attachments.size) // Apaga o aviso quando termina de processar todas as imagens
                    feedbc.delete();
            }else // Efeito não encontrado
                return message.lineReply(":mag: | "+ utilitarios[7]["efeito_errado"] +""+ emoji_dancante +"` `");
        });
    }
};
