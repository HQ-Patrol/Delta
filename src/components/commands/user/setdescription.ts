import { AvatarModel, IAvatar } from "../../../database/models/AvatarModel";
import { IUser, User } from '../../../database/models/UserModel';
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
    name: "setdescription",
    description: "Set a description to be shown everytime your profile is fetched"
})

export class DescriptionCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("Description")
                .setMaxLength(400)
                .setRequired(true)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        await interaction.deferReply();
        
        const description = interaction.options.getString("description")!;

        let avatar  = await AvatarModel.findOne<IAvatar>({ userID: interaction.user.id }) // Throwing Errors of types.
        if(!avatar){
        // Create the profile !
            avatar = await AvatarModel.create({ userID: interaction.user.id, username: interaction.user.username })
        }

        let user = await User.findOne<IUser>({ _id: interaction.user.id })
        if(!user){
            // Create the user profile.
            user = await User.create({ _id: interaction.user.id, premium: false })
        }

        if(!user.premium){
            if(description.includes("discord.gg") || description.includes("www.") || description.includes(".com")){
                return interaction.editReply({ content: "**Only Premium Users** are allowed to have invite-links/web-links in their Descriptions. Maybe become one?" })
            }

            if(description.length > 128){
                return interaction.editReply(({ embeds: [{ color: "RED", description: "Your description length can't be greater than 128 characters. Unlucky gg well played🙄\n[__*Premium members of Patrol Bot have x3 Description Limit*__ <:EricaEvilPlotting:897841584647847986>] " }] }) )
            }
        }

        avatar.description = description;
        await AvatarModel.updateOne({ userID: interaction.user.id }, { description: description });
        return interaction.editReply({ content: `\`Your profile description has been saved~\`🙈` })
    }
}