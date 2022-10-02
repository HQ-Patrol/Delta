import { readFileSync, writeFileSync } from 'fs';
import { items } from '../../../data/json/items.json';
import { Economy as Eco, IEconomy } from '../../../database/models/EconomyModel';
import config from '../../../config';
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export class RedeemCommand extends Command{

    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName("redeem")
            .setDescription("Redeem your Patrol Giftcodes here to get some nice rewards")
            .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("Redeem Code")
                .setRequired(true)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        const args = interaction.options.getString("code")!;

        if(args === "view"){
            if(!config.owner.includes(interaction.user.id)) { return interaction.reply({ content: "Nope.No shot." }) }

            let resMB1 = ''; let resMB2 = ''; let resMB3 = ''; let resMBOXX = ''; let resMBXL = ''; let resP1M = ''; let resPL = ''; let resSBE = ''; let resMBE = ''; let resHBE = ''; let resT0 = ''; let resT1 = ''; let resT2 = ''; let resT3 = ''; let resT4 = ''; let resT5 = '';
            const ALL = JSON.parse(readFileSync("./src/data/json/redeem.json").toString())
            const message = await interaction.reply({ content: "Fetching...", fetchReply: true }) as Message;

            for(const d of ALL.GOD) {
                //return console.log(ALL.GOD);
                if(String(d).startsWith("MB1")) resMB1 += `${d}\n`
                else if(String(d).startsWith("MB2")) resMB2 += `${d}\n`
                else if(String(d).startsWith("MB3")) resMB3 += `${d}\n`
                else if(String(d).startsWith("MBOXX")) resMBOXX += `${d}\n`
                else if(String(d).startsWith("MBXL")) resMBXL += `${d}\n`
                else if(String(d).startsWith("P1M")) resP1M += `${d}\n`
                else if(String(d).startsWith("PL")) resPL += `${d}\n`
                else if(String(d).startsWith("SBE")) resSBE += `${d}\n`
                else if(String(d).startsWith("MBE")) resMBE += `${d}\n`
                else if(String(d).startsWith("HBE")) resHBE += `${d}\n`
                else if(String(d).startsWith("T0")) resT0 += `${d}\n`
                else if(String(d).startsWith("T1")) resT1 += `${d}\n`
                else if(String(d).startsWith("T2")) resT2 += `${d}\n`
                else if(String(d).startsWith("T3")) resT3 += `${d}\n`
                else if(String(d).startsWith("T4")) resT4 += `${d}\n`
                else if(String(d).startsWith("T5")) resT5 += `${d}\n`
            }
            const trimmedString11 = resMB1.substring(0, 1600);
            const trimmedString12 = resMB1.substring(1600, 3200);
            const trimmedString13 = resMB1.substring(3200, 4800);
            await message.channel.send(`__**Mystery Box 1 (#1)**__:\n${trimmedString11}\n`);
            await message.channel.send(`__**Mystery Box 1 (#2)**__:\n${trimmedString12}\n`);
            await message.channel.send(`__**Mystery Box 1 (#3)**__:\n${trimmedString13}\n`);
            const trimmedString21 = resMB2.substring(0, 1600);
            const trimmedString22 = resMB2.substring(1600, 3200);
            const trimmedString23 = resMB2.substring(3200, 4800);
            await message.channel.send(`__**Mystery Box 2 (#1)**__:\n${trimmedString21}\n`);
            await message.channel.send(`__**Mystery Box 2 (#2)**__:\n${trimmedString22}\n`);
            await message.channel.send(`__**Mystery Box 2 (#3)**__:\n${trimmedString23}\n`);
            const trimmedString31 = resMB3.substring(0, 1600);
            const trimmedString32 = resMB3.substring(1600, 3200);
            const trimmedString33 = resMB3.substring(3200, 4800);
            await message.channel.send(`__**Mystery Box 3 (#1)**__:\n${trimmedString31}\n`);
            await message.channel.send(`__**Mystery Box 3 (#2)**__:\n${trimmedString32}\n`);
            await message.channel.send(`__**Mystery Box 3 (#3)**__:\n${trimmedString33}\n`);
            const trimmedStringX1 = resMBOXX.substring(0, 1600);
            const trimmedStringX2 = resMBOXX.substring(1600, 3200);
            const trimmedStringX3 = resMBOXX.substring(3200, 4800);
            await message.channel.send(`__**Mystery Box XXX (#1)**__:\n${trimmedStringX1}\n`);
            await message.channel.send(`__**Mystery Box XXX (#2)**__:\n${trimmedStringX2}\n`);
            await message.channel.send(`__**Mystery Box XXX (#3)**__:\n${trimmedStringX3}\n`);
            const trimmedStringXL1 = resMBXL.substring(0, 1600);
            const trimmedStringXL2 = resMBXL.substring(1600, 3200);
            const trimmedStringXL3 = resMBXL.substring(3200, 4800);
            await message.channel.send(`__**Mystery Box XL (#1)**__:\n${trimmedStringXL1}\n`);
            await message.channel.send(`__**Mystery Box XL (#2)**__:\n${trimmedStringXL2}\n`);
            await message.channel.send(`__**Mystery Box XL (#3)**__:\n${trimmedStringXL3}\n`);
            const trimmedStringP1M1 = resP1M.substring(0, 1600);
            const trimmedStringP1M2 = resP1M.substring(1600, 3200);
            const trimmedStringP1M3 = resP1M.substring(3200, 4800);
            await message.channel.send(`__**Premium 1M (#1)**__:\n${trimmedStringP1M1}\n`);
            await message.channel.send(`__**Premium 1M (#2)**__:\n${trimmedStringP1M2}\n`);
            await message.channel.send(`__**Premium 1M (#3)**__:\n${trimmedStringP1M3}\n`);
            const trimmedStringPL1 = resPL.substring(0, 1600);
            const trimmedStringPL2 = resPL.substring(1600, 3200);
            const trimmedStringPL3 = resPL.substring(3200, 4800);
            await message.channel.send(`__**Premium Lifetime (#1)**__:\n${trimmedStringPL1}\n`);
            await message.channel.send(`__**Premium Lifetime (#2)**__:\n${trimmedStringPL2}\n`);
            await message.channel.send(`__**Premium Lifetime (#3)**__:\n${trimmedStringPL3}\n`);
            const trimmedStringSBE1 = resSBE.substring(0, 1600);
            const trimmedStringSBE2 = resSBE.substring(1600, 3200);
            const trimmedStringSBE3 = resSBE.substring(3200, 4800);
            await message.channel.send(`__**Soft Boiled Egg (#1)**__:\n${trimmedStringSBE1}\n`);
            await message.channel.send(`__**Soft Boiled Egg (#2)**__:\n${trimmedStringSBE2}\n`);
            await message.channel.send(`__**Soft Boiled Egg (#3)**__:\n${trimmedStringSBE3}\n`);
            const trimmedStringMBE1 = resMBE.substring(0, 1600);
            const trimmedStringMBE2 = resMBE.substring(1600, 3200);
            const trimmedStringMBE3 = resMBE.substring(3200, 4800);
            await message.channel.send(`__**Medium Boiled Egg (#1)**__:\n${trimmedStringMBE1}\n`);
            await message.channel.send(`__**Medium Boiled Egg (#2)**__:\n${trimmedStringMBE2}\n`);
            await message.channel.send(`__**Medium Boiled Egg (#3)**__:\n${trimmedStringMBE3}\n`);
            const trimmedStringHBE1 = resHBE.substring(0, 1600);
            const trimmedStringHBE2 = resHBE.substring(1600, 3200);
            const trimmedStringHBE3 = resHBE.substring(3200, 4800);
            await message.channel.send(`__**Hard Boiled Egg (#1)**__:\n${trimmedStringHBE1}\n`);
            await message.channel.send(`__**Hard Boiled Egg (#2)**__:\n${trimmedStringHBE2}\n`);
            await message.channel.send(`__**Hard Boiled Egg (#3)**__:\n${trimmedStringHBE3}\n`);
            await message.channel.send(`__**Tier 0**__:\n${resT0.substring(0, 1600)}\n`);
            await message.channel.send(`__**Tier 1**__:\n${resT1.substring(0, 1600)}\n`);
            await message.channel.send(`__**Tier 2**__:\n${resT2.substring(0, 1600)}\n`);
            await message.channel.send(`__**Tier 3**__:\n${resT3.substring(0, 1600)}\n`);
            await message.channel.send(`__**Tier 4**__:\n${resT4.substring(0, 1600)}\n`);
            await message.channel.send(`__**Tier 5**__:\n${resT5.substring(0, 1600)}\n`);

            return message.delete().catch((e: Error) => console.log(e));
        }
        const message = await interaction.reply({ content: "Checking....", fetchReply: true }) as Message;
        const addedMembers = [];
        for(const arg of args.split("\n")){
            const codes = JSON.parse(readFileSync("./src/data/json/redeem.json").toString());
            const index = codes.GOD.indexOf(arg)

            if(index > -1){
                codes.GOD.splice(index, 1)
            }
            else{
                await message.channel.send(`\`${arg}\` is either an Expired/Invalid/Duplicate Code <a:exclamation:741988026296696872>`)
                continue;
            }
            let quantity: number;
            let itemName: string;

            if(arg.startsWith("MB1")) { itemName = "Mystery Box 1"; quantity = 3; }
            else if(arg.startsWith("MB2")) { itemName = "Mystery Box 2"; quantity = 2; }
            else if(arg.startsWith("MB3")) { itemName = "Mystery Box 3"; quantity = 1; }
            else if(arg.startsWith("MBOXX")) { itemName = "Mystery Box XXX"; quantity = 1; }
            else if(arg.startsWith("P1M")) { itemName = "Premium 1M"; quantity = 1; }
            else if(arg.startsWith("PL")) { itemName = "Premium Lifetime"; quantity = 1; }
            else if(arg.startsWith("MBXL")) { itemName = "Mystery Box XL"; quantity = 1; }
            else if(arg.startsWith("SBE")) { itemName = "Soft Boiled Egg"; quantity = 3; }
            else if(arg.startsWith("MBE")) { itemName = "Medium Boiled Egg"; quantity = 1; }
            else if(arg.startsWith("HBE")) { itemName = "Hard Boiled Egg"; quantity = 1; }
            else if(arg.startsWith("CBUND")) { itemName = "Candy Bundle"; quantity = 1; }
            else itemName = "QQQQ"; quantity = 1;

            const item = items.find(item => item.name.toLowerCase() === itemName.toLowerCase()) ;

            if(!item) {
                let roleID: string;

                if(message.guild!.id == "793849034266902559") {
                    if(arg.startsWith("T0")) { roleID = "793849034346463278"; }
                    else if(arg.startsWith("T1")) { roleID = "793849034363895842"; }
                    else if(arg.startsWith("T2")) { roleID = "793849034363895846"; }
                    else if(arg.startsWith("T3")) { roleID = "793849034384605251"; }
                    else if(arg.startsWith("T4")) { roleID = "793849034506764305"; }
                    else if(arg.startsWith("T5")) { roleID = "793849034506764307"; }
                    else {roleID = "";}

                    if(roleID !== ""){
                        const role = message.guild!.roles.cache.get((roleID))!
                        message.member!.roles.add(role).catch((() => message.channel.send({ embeds: [{ color: "RED", description: `Couldn't Add role, Please DM @Sinless#0001` }] })));

                        writeFileSync("./src/data/json/redeem.json", JSON.stringify(codes));
                        addedMembers.push(`✅ ${arg} <@&${roleID}>`);
                    }
                    else {continue;}

                }

                else if(message.guild!.id == "661955226789609493") {
                    if(arg.startsWith("T0")) { roleID = "897112796150509628"; }
                    else if(arg.startsWith("T1")) { roleID = "722786290134810674"; }
                    else if(arg.startsWith("T2")) { roleID = "722786391032856627"; }
                    else if(arg.startsWith("T3")) { roleID = "722786600987131975"; }
                    else if(arg.startsWith("T4")) { roleID = "722786686454464523"; }
                    else if(arg.startsWith("T5")) { roleID = "831977569695039530"; }
                    else {roleID = ""}

                    if(roleID !== ""){
                        const role = message.guild!.roles.cache.get(roleID)!
                        message.member!.roles.add(role).catch(() => message.channel.send({ embeds: [{ color: "RED", description: `Couldn't Add role, Please DM @Sinless#0001` }] }));

                        writeFileSync("./src/data/json/redeem.json", JSON.stringify(codes));
                        addedMembers.push(`✅ ${arg} <@&${roleID}>`);
                    }
                }
                else { return message.channel.send('PLEASE use the Redeem code in the correct server to get your Special Role!') }


            }
            else{
                const duplicateIndex = addedMembers.indexOf(`✅ ${arg} ${item.icon}`);
                if (duplicateIndex > -1) {
                    continue;
                }

                const person = await Eco.findOne<IEconomy>({
                    id: message.author.id
                });

                if(!person) {
                    await Eco.create({ id: message.author.id, coins: 0, bank: 0, xp: 0, level: 1, items: [item] })
                } else {
                    const otherStuff = person.items;
                    const otherItem = otherStuff.find((item) => item.name.toLowerCase().includes(itemName.toLowerCase()));
                    const otherIndex = otherStuff.findIndex((item) => item.name.toLowerCase().includes(itemName.toLowerCase()));

                    if(otherItem && otherIndex >= 0) {
                        otherStuff[otherIndex].count += quantity;

                        await Eco.findOneAndUpdate({
                                id: message.author.id
                            },
                            {
                                items: otherStuff
                            });
                    } else {
                        otherStuff.push({
                            name: item.name,
                            count: quantity,
                            data: item.data,
                            type: item.type,
                            icon: item.icon,
                        });
                        await Eco.findOneAndUpdate({
                                id: message.author.id
                            },
                            {
                                items: otherStuff
                            });
                    }
                }
                writeFileSync("./src/data/json/redeem.json", JSON.stringify(codes));
                addedMembers.push(`✅ ${arg} ${item.icon}`);
            }
        }

        if(addedMembers.length==0) return;
        await message.channel.send({ embeds: [new MessageEmbed().setColor("RANDOM").setDescription(`${addedMembers.join("\n") }`).setTitle(`Redeemed ${addedMembers.length} Codes 🎟`)] });

        const logEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
                `Added to: <@${message.author.id}> \`[${
                    message.author.id
                }]\` in ${message.guild!.name} \`[${
                    message.guild!.id
                }]\`\n\n${addedMembers.join("\n")}`
            )
            .setAuthor({
                name: `Redeemed ${addedMembers.length} Codes 🎟`,
                iconURL: `https://i.imgur.com/wyT4raG.gif`,
            });

        const channel = interaction.client.channels.cache.get("880072529463627806") as TextChannel
        return channel.send({ embeds: [logEmbed] }).catch(e => console.log(e));

    }
}