import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>
(
    {
        name: "fight",
        description: "Fight any person to death and loser shall get MUTED for a random amount of time!",
        cooldownDelay: 10
    }
)
export class FightCommand extends Command {

}