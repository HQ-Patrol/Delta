/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
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
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName("choice")
                        .setDescription("Heads or Tails")
                        .setRequired(true)
                        )
                .addIntegerOption((option) =>
                    option
                        .setName("bet")
                        .setDescription("Amount to bet")
                        .setMaxValue(100000)
                        .setMinValue(1)
                        .setRequired(true))
                    );
    }
    public async chatInputRun(intention: Command.ChatInputInteraction) {
        const person = findByUserId(intention.user.id);
        const bet = intention.options.getInteger("bet") || 100;
        const choice = intention.options.getString("choice") || "h";
        const chance =  Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        const balance = (await person).coins;
        let choiceInt;

        if (choice.toLowerCase() == "heads" || "h") {
            choiceInt = 1;

        } else if (choice.toLowerCase() == "tails" || "t") {
            choiceInt = 2;
        }

        if (chance != choiceInt) {
            (await person).$set("coins", balance - bet).save();
            return intention.reply("Better luck next time!");
        } else {
            (await person).$set("coins", balance + (bet*2)).save();
            return intention.reply(`Congrats you won: ${bet*2}`)
        }
    }
}
