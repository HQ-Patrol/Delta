/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { ButtonInteraction, MessageActionRow, MessageActionRowComponent, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { readFile } from "node:fs/promises";
import { parse } from "hjson";
import emoji from "../../../constants/emoji";
import ComponentMenu from "../../../utilities/classes/ComponentMenu";

let guide: Record<string, any> | null = null;
export async function getGuide() {
    if(!guide) {
        let data = await readFile("./src/data/json/guide.hjson", "utf-8");
        // replace variables, etc
        data = data.
            replace(/\\/g, "`")
            .replace(/{prefix}/g, "/") // due to recode
            .replace(/%(.+?)%/g, (_: unknown, cap: string) => (emoji as any)[cap]);
        guide = await parse(data);
    } 
    return guide;
}

// cache
const buttons: Record<string, MessageActionRowComponent[]> = {};
let selectMenu: MessageActionRow | null = null;

@ApplyOptions<Command.Options>({
    name: "help",
    description: "Want to know more about Patrol Bot? Run this command!"
})
export class HelpCommand extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction) {
        const guide = await getGuide();
        if(!guide) return;

        let selectedOption = "mainMenu"; // the "category"
        let selectedMenu: string | null = null; // the tabs of the category, null defaults to the default menu

        const handler = (int: SelectMenuInteraction | ButtonInteraction) => {
            int.deferUpdate(); 
            if(int.isSelectMenu()) {
                // change selected option
                selectedOption = int.values?.[0];
                selectedMenu = null; // default menu
            } else {
                // change menu
                selectedMenu = int.customId;
            }
            update();
        }

        const update = (init = false) => {
            const option = guide[selectedOption];
            if(selectedMenu == null) {
                const values = Object.entries(option.menus);
                const find = values.find((menu: any) => menu[1]?.default === true);
                selectedMenu = find?.[0] || values[0][0];
            }

            // select menu:
            if(!selectMenu) {
                console.log("GENERATING SELECT MENU");
                // generate select menu, otherwise just fetch from cache
                const options = [];
                for(const [optionId, option] of Object.entries(guide)) {
                    options.push({
                        label: option.selectMenuLabel,
                        value: optionId,
                        description: option.description,
                        emoji: option.emoji,
                        default: false
                    })
                }

                selectMenu = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("select")
                            .setPlaceholder("Learn more about Patrol Bot!")
                            .addOptions(options)
                    )
                   
            }

            // embed:
            const embedInfo = guide[selectedOption].menus[selectedMenu].embed;
            const embed = new MessageEmbed()
            embedInfo?.title && embed.setTitle(embedInfo.title);
            embedInfo?.description && embed.setDescription(embedInfo
                .description
                .replace(/\\/g, "`")
                .replace(/{prefix}/g, "/") // due to recode
                .replace(/%(.+?)%/g, (_: unknown, cap: string) => (emoji as any)[cap]));
            embedInfo?.color && embed.setColor(embedInfo.color);

            // buttons
            if(!buttons[selectedOption]) {
                console.log("GENERATING BUTTONS FOR " + selectedOption);
                // generate buttons for the option
                const row = [];
                for(const m in option.menus) {
                    const component = option.menus[m].component;
                    if(component?.link) {
                        row.push(
                            new MessageButton()
                                .setURL(component.url)
                                .setLabel(component.label)
                                .setStyle("LINK")
                        )
                    } else {
                        row.push(
                            new MessageButton()
                                .setCustomId(m)
                                .setLabel(component.label)
                                .setStyle(component.style)
                        )
                    }
                }
                buttons[selectedOption] = row;
            }

            // override
            const components = buttons[selectedOption];
            const find = components.find((c) => c.customId === selectedMenu);
            if(find) find.disabled = true;
            const buttonRow = new MessageActionRow().setComponents(components);
            const menuRow = selectMenu;

            menu.embed = embed;
            if(init) {
                menu.components = [buttonRow, menuRow];
                menu.send();
            } else {
                menu.components[0] = buttonRow;
                menu.update();
            }
            if(find) find.disabled = false;
        }

        const menu = new ComponentMenu(interaction)
            .whitelist(interaction.user.id)
            .listen(handler);

        update(true);
    }
}


/*
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
        */