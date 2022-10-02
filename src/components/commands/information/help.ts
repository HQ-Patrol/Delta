/*
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Hjson from 'hjson';
import AdvancedComponentMenu from '../../../utilities/classes/ComponentMenu';
import FS from 'node:fs';
import { MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
const fs = FS.promises;

let guide :any;

@ApplyOptions<Command.Options>({
    name: "help",
    description: "Explains the usage of the bot"
})

export class HelpCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        // Help command
        if(!guide) {
            const data = await fs.readFile("../../../data/json/guide.hjson", "utf-8");
            guide = await Hjson.parse(data);
        }

        // Main Command
        let selectedOption = "mainMenu";
        let selectedMenu = false;


        const handler = async (int: MessageComponentInteraction) => {
            await int.deferUpdate();
            if(int.isSelectMenu()) {
                // Change selected option, reset selected menu to default.
                selectedOption = int.values?.[0];
                selectedMenu = null;
                await updateComponents();
            } else if(int.isButton()) {
                selectedMenu = int.customId;
                await updateComponents();
            }
        };


        const selectMenu = () => {
            const selectMenuOptions = [];
            for(const [key, value] of Object.entries(guide)) {
                selectMenuOptions.push({
                    label: (value as any).selectMenuLabel,
                    value: key,
                    description: (value as any).description,
                    emoji: (value as any).emoji,
                    default: (selectedOption === key)
                });
            }
            return new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId("select")
                        .setPlaceholder("Learn more about Patrol Bot!")
                        .addOptions(selectMenuOptions)
                );
        };

        const updateComponents = async (returnComponents = false) => {
            const menus = Object.entries(guide[selectedOption].menus);

            // Update Embed
            let foundEmbed;
            if(!selectedMenu) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore TODO : FIX THIS LATER
                foundEmbed = (menus?.find(m => m[0] === selectedMenu)![1] as any).embed;
            } else {
                const found = menus.find(m => m[1].default === true);
                foundEmbed = found[1].embed;
                selectedMenu = found[0];
            }

            const embed = new Discord.MessageEmbed();
            foundEmbed?.title && embed.setTitle(foundEmbed.title);
            foundEmbed?.description && embed.setDescription(foundEmbed.description.replace(/\\/g, "`").replace(/{prefix}/g, prefix));
            foundEmbed?.color && embed.setColor(foundEmbed.color);
            menu.embed = embed;

            // Update buttons
            const buttonRow = new Discord.MessageActionRow();
            // Buttons
            for(const [key, value] of menus) {
                if(value.component.link) {
                    buttonRow.addComponents(
                        new Discord.MessageButton()
                            .setLabel(value.component.label)
                            .setStyle("LINK")
                            .setURL(value.component.url)
                    );
                } else {
                    buttonRow.addComponents(
                        new Discord.MessageButton()
                            .setLabel(value.component.label)
                            .setStyle(value.component.style)
                            .setCustomId(key)
                            .setDisabled(selectedMenu === key)
                    );
                }
            }

            if(returnComponents) {
                return [buttonRow, selectMenu()];
            } else {
                menu.components = [buttonRow, selectMenu()];

                // update!
                return await menu.update();
            }
        };

        const mainMenuEmbed = guide["mainMenu"].menus["mainMenu"].embed;
        const menu = new AdvancedComponentMenu(message)
            .setDefaultEmbed(
                new Discord.MessageEmbed()
                    .setTitle(mainMenuEmbed.title)
                    .setDescription(mainMenuEmbed.description.replace(/\\`/g, "`").replace(/{prefix}/g, prefix))
                    .setColor(mainMenuEmbed.color)
            )
            .setHandler(handler);

        menu.components = await updateComponents(true);
        await menu.send();
    }
}
*/