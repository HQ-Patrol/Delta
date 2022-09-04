import ms from 'ms'
import { HexColorString } from 'discord.js';
import { User } from './../../../database/models/UserModel';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import findByUserId from '../../../database/functions/economy/findUserById';

@ApplyOptions<Command.Options>
(
    {
        name: "fight",
        description: "Fight any person to death and loser shall get MUTED for a random amount of time!",
        cooldownDelay: 10
    }
)
export class FightCommand extends Command {

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) => 
                    option
                        .setName('User')
                        .setDescription("User to fight")
                        .setRequired(true))
                .addBooleanOption((option) =>
                    option
                        .setName('Enabled')
                        .setDescription("Allows you to enable or disable fights")
                        .setRequired(false))
        );
    }

    public override async chatInputRun(intention: Command.ChatInputInteraction) {
        const intentionTarget = intention.options.getUser('User');
        const sender = await findByUserId(intention.user.id);
        const target = await findByUserId(intentionTarget!.id) || null;
        const targetUserDoc = await User.findOne({ id: target.id });
        const chance =  Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        const targetEnabled = target.minigames.fight.enabled;
        const guild = intention.guild;

        let mutedRole = guild?.roles.cache.find((role) => role.name == "Muted");
        let senderEnabled = sender.minigames.fight.enabled;
        
        if (intention.options.getBoolean('Enabled') == true) {
            (await target).$set("minigames.fight.enabled", true).save();
             senderEnabled = sender.minigames.fight.enabled;
        } else {
            (await target).$set("minigames.fight.enabled", true).save();
             senderEnabled = sender.minigames.fight.enabled;
        }

        if (senderEnabled && targetEnabled) {
            if (chance == 1) {
                (await sender).$set("minigames.fight.wins", sender.minigames.fight.wins + 1);
                (await target).$set("minigames.fight.losses", target.minigames.fight.losses + 1);
                targetUserDoc?.$set("muted", true);
                if (targetUserDoc?.muted) {
                    if (!mutedRole) {
                        guild!.roles.create({
                            name: "Muted",
                            color: new String("0xbcc0c0") as HexColorString
                        });
                        mutedRole = guild!.roles.cache.find((role) => role.name == "Muted");
                    }
                    guild!.members.cache.get(intentionTarget!.id)?.roles.add(mutedRole!.id)
                    setTimeout(() => {
                        guild!.members.cache.get(intentionTarget!.id)?.roles.remove(mutedRole!.id);
                    }, ms('10s') )
                }
                return intention.reply(`Congrats! You won your fight against ${target}`);
            } else {
                (await sender).$set("minigames.fight.wins", sender.minigames.fight.losses + 1);
                intention.reply(`Too bad! You lost your fight against ${target}`);
            }
        }
    }
}