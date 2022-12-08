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
