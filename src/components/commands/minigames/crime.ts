import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
} from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import { rndNumber } from "../../../utilities/query/pets";
import DeltaClient from "../../../utilities/classes/DeltaClient";

let crimes = {
  // I added an array here, so in the future, custom messages / headings is supported and easy.
  Arson: [
    "<a:fire:942393701374783528>",
    "Amongst the flames you saved a Pristine Copy of Gutenberg Bible which was worth a fortune",
    "You burned the whole place down, good job 👏",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Bank Robbery": [
    "🦹",
    "No friggin' way you found a Red Diamond in Bank Vaults, KACHING 💲!",
    "You were able to Get in and Get out without much hassle. Easy Money",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Robbery: [
    "<:blobPeak:942394794469113977>",
    "They were coming straight out of the Bank, what a Dub!",
    "They didn't have much money, but atleast you got their Phone",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Drug Dealing": [
    "<:weedripe:942396511487152129>",
    "Oh shiz, Cartel gifted you a Special Bonus for being so good at it.",
    "Deal was a success, no opp involved 🤝",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Manslaughter: [
    "<a:Knife:942394508417564703>",
    "The dead person turned out to be a rich fellar, damn nice.",
    "Okay that really happened",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Run Over": [
    "🚸",
    "You ran over a family of 4 but the Guy who was going to Testify against you was found dead a day earlier. Wonder what happened!",
    "Oh it was just an Immigrant, who cares right?",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Jump Light": [
    "🚦",
    "You jumped multiple light and didn't get Caught!",
    "Traffic Cam glitched and you weren't caught in the Providence",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Domestic Violence": [
    "👊",
    "You were about to be Convicted but Judge agreed to let it slide as it was Funky Monkey Friday and you had to go Ape",
    "You followed what Jon Jones taught you and came out Victorious 💪",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Cyber Crimes": [
    "<a:MonkeType:942397307993870377>",
    "You Stole millions of Bitcoins from FBI Wallet",
    "You hacked into your Bully's Computer and stole their Parents bank details",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  "Identity Theft": [
    "<:Anonymous:945072261583491112>",
    "You did it. Now you live your life as Angelina Jolie's 3rd adopted Asian Child",
    "You barely succeeded into taking on Identity of someone named Ralph Bohner",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Genocide: [
    "🩸",
    "Good job, so YOU were the Zodiac Killer after all...",
    "You acted as a Victim and were let off",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Shank: [
    "🔪",
    "So many stabbing wounds made the Judge faint, enjoy your free life",
    "You eliminated your opp successfully 🔪",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Fraud: [
    "😵‍💫",
    "O Oo A Aa, your Baboon NFT was a Raging success!",
    "You were able to Fool people by acting as a Stock Broker",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Assault: [
    "💪",
    "Your utter Fear of Strength made everyone withdraw their statements against you",
    "That was a successful assault ngl",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Vandalism: [
    "<:myf_SpraySpray:942397968382836826>",
    "You lead the team of Vandals and made a killing!",
    "You did a decent job at ruining Karen's Toyota, gg.",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
  Larceny: [
    "<:JiggaGiveIt:839090244665475092>",
    "You pleaded 'Oopsie Daisie' in court and they ruled in favor of you 😳",
    "You got away with it, lucky af",
    "Oh snap, someone leaked the plan. Police was waiting for you...",
  ],
};

@ApplyOptions<Command.Options>({
  name: "crime",
  description:
    "Do some bad things and there's a high chance of you either getting coins or busted and charged 😭",
})
export class CrimeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (
      (interaction.client as DeltaClient).cooldowns.crime.get(
        interaction.user.id
      ) > Date.now()
    ) {
      interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("#FF0000")
              .setDescription(
                `Please wait for another **${(
                  ((interaction.client as DeltaClient).cooldowns.crime.get(
                    interaction.user.id
                  ) -
                    Date.now()) /
                  1000
                ).toFixed(
                  1
                )}s** before committing another hate crime <a:exclamation:741988026296696872>`
              ),
          ],
        })
        .then((m: any) => setTimeout(() => m.delete(), 9000));
    } else {
      let selectedCrimes = {};
      // Pick 3 crimes randomly from array.
      let selectedCrimesFromArray = Object.keys(crimes)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      // Pick 3 rewards randomly.
      let selectedRewardsFromArray = ["-", "+", "3"].sort(
        () => 0.5 - Math.random()
      );

      for (let i = 0; i < selectedCrimesFromArray.length; i++) {
        // @ts-ignore
        selectedCrimes[selectedCrimesFromArray[i]] =
          selectedRewardsFromArray[i];
      }

      let components = new MessageActionRow();
      for (const crime in selectedCrimes) {
        components.addComponents(
          new MessageButton()
            .setStyle("SUCCESS")
            .setLabel(`${crime}`) // temp literal just in case
            .setCustomId(crime)
            // @ts-ignore
            .setEmoji(crimes[crime][0])
        );
      }

      // Display embed
      let embed = new MessageEmbed()
        .setAuthor({
          iconURL: interaction.user.displayAvatarURL(),
          name: "Crime",
        })
        .setDescription("What crime would you like to commit today?")
        .setColor("BLURPLE");

      let crimeEmbedMessage = await interaction.reply({
        embeds: [embed],
        components: [components],
        fetchReply: true,
      });
      // @ts-ignore
      const collector = crimeEmbedMessage.createMessageComponentCollector({
        idle: 30_000,
      });
      collector.on("collect", async (cinteraction: ButtonInteraction) => {
        await cinteraction.deferUpdate();
        if (interaction.user.id !== cinteraction.user.id)
          return cinteraction.reply({
            content: "Aye! This ain't your time to crime!",
            ephemeral: true,
          });
        // Prevent somehow
        if (!selectedCrimesFromArray.includes(cinteraction.customId)) return;
        // @ts-ignore
        let sign = selectedCrimes[cinteraction.customId];
        let money = rndNumber(50, 250);

        switch (sign) {
          case "-":
            money = -money;
            break;
          case "3":
            money *= 3;
            break;
        }

        embed.setAuthor({
          iconURL: interaction.user.displayAvatarURL(),
          name: "Crime Committed: " + cinteraction.customId,
        });
        embed.setColor(
          // @ts-ignore
          {
            "-": "RED",
            "+": "GREEN",
            3: "YELLOW",
          }[sign]
        );
        embed.setDescription(
          `*${
            // @ts-ignore
            {
              // @ts-ignore
              "-": crimes[cinteraction.customId][3],
              // @ts-ignore
              "+": crimes[cinteraction.customId][2],
              // @ts-ignore
              3: crimes[cinteraction.customId][1],
            }[sign]
          }*\n↬ \`You Ended up with:\` **\`${money}\`** <a:Coins:775714101564276756>`
        );

        // Update components
        components.components.forEach((component: any) => {
          component.setDisabled(true);
          component.setStyle(
            // @ts-ignore
            {
              3: "SUCCESS",
              "-": "DANGER",
              "+": "SECONDARY",
              // @ts-ignore
            }[selectedCrimes[component.customId]]
          );
          component.setLabel(
            `${component.label} - ${
              // @ts-ignore
              {
                3: "JACKPOT 💰",
                "-": "Lost 👎",
                "+": "Won 👍",
                // @ts-ignore
              }[selectedCrimes[component.customId]]
            }`
          );
          // @ts-ignore
          component.setEmoji(crimes[component.customId][0]);
        });

        // @ts-ignore
        await crimeEmbedMessage.edit({
          embeds: [embed],
          components: [components],
        });

        await Eco.updateOne(
          { id: cinteraction.user.id },
          { $inc: { coins: money, xp: 2 } }
        );
      });
      (interaction.client as DeltaClient).cooldowns.crime.set(
        interaction.user.id,
        Date.now() + 120000
      );
    }
  }
}
