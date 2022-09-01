/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
import { Message } from 'discord.js';
import { ApplyOptions } from "@sapphire/decorators";
import { Args, ChatInputCommand, Command } from "@sapphire/framework";
import findByUserId from '../../../database/functions/economy/findUserById';

@ApplyOptions<Command.Options>
    (
        {
            name: "coinflip",
            description: "Flip a coin and gamble your money away!",
            aliases: ["cf"],
            cooldownDelay: 3,
        }
    )
export class CoinFlipCommand extends Command {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description));
    }
    public async messageRun(message: Message, args: Args) {
        const person = findByUserId(message.author.id);
        let balance = (await person).coins;
        const maxBet = 10000;
        const bet = await args.pick("number");
        const choice = await args.pick("string");
        
        if ( choice != 'h' || 't' || 'heads' || 'tails') {
            return message.reply("Invalid choice!")
        } else if (bet > maxBet) {
            return message.reply(`You can only bet a maximum of ${maxBet} at a time`)
        } else {
           const chance =  Math.floor(Math.random() * (2 - 1 + 1)) + 1;

           if (chance == 1 ) {
                 balance = balance + (bet*2)
           } else {
           return message.reply("Sorry! Better luck next time!")
           }
        }
    }
}
