import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { IUser, User } from "../../../database/models/UserModel";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "dms",
    description: "Toggle DMs on/off from the bot."
})

export class DmsCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("toggle")
                .setDescription("Toggle on/off")
                .setRequired(true)
                .setChoices(
                    {
                        name: "on",
                        value: "on"
                    },
                    {
                        name: "off",
                        value: "off"
                    }
                )
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        // Temp solution for types-errors
        let user = await User.findOne<IUser>({ _id: interaction.user.id } ).lean();
        if(!user) user = await User.create({ _id: interaction.user.id, premium: false, blacklisted: false, DMs: true })


        await interaction.deferReply();
        const choice = interaction.options.getString("toggle")!

        if(choice === 'on'){
            if(user.DMs){
                return interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription("Your DMs are already open!  Do you want to turn them **OFF** by any chance??? <a:CoughCough:776772198660702238> ")] })

            }
            else{
                await User.updateOne({ _id: interaction.user.id }, { DMs: true })
                return interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription("You **OPENED** and can now be sent Images from me! <a:YAY:783693442747727912>")] });
            }
        }

        else if(choice === "off"){
            //Turn off DMs.
            if(!user.DMs){
                return interaction.editReply({ embeds: [{ color: "YELLOW", description: "Your DMs are already closed for me, Stop being paranoid and maybe turn this **ON** <a:HamsterJigga:731172699639906397> " }] });
            }
            else{
                await User.updateOne({ _id: interaction.user.id }, { DMs: false })
                return interaction.editReply({ embeds: [{ color: "GREEN", description: "You **CLOSED** your DMs for Images from me! <a:notamused:750080936191721512> " }] })
            }
        }
    }
}