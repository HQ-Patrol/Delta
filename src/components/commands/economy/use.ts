import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findUserById from "../../../database/functions/economy/findUserById";

import sendError from "../../../utilities/sendError";
import { findItem } from "../../../utilities/query/item";
import { removeItemFromUser } from "../../../utilities/query/inventory";

import { IItem } from "../../../types/Item";
import { getUse } from "../../../utilities/use";
@ApplyOptions<Command.Options>({
  name: "use",
  description: "Use your economy items!",
})
export class UseCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription(
              "Item name (case insensitive), supports aliases (e.g mb1 for Mystery Box 1)"
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("quantity")
            .setMinValue(1)
            .setDescription(
              "What quantity of this item do you want to give to this user?"
            )
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const item = interaction.options.getString("item", true);
    let quantity = interaction.options.getInteger("quantity") || 1;

    // Verify item
    const itemFind = findItem(item.toLowerCase()) as IItem;
    if (!itemFind)
      return sendError(
        interaction,
        "Please provide a valid item name or alias!"
      );
    if (!itemFind.data.canBeUsed)
      return sendError(interaction, "This item cannot be used!");

    const user = await findUserById(interaction.user.id);
    const find = user.items.find((i) => i.name === itemFind.name);
    if (!find || find.count < quantity) {
      return sendError(
        interaction,
        `You do not have enough ${itemFind.icon} **${itemFind.name}**! You need **${quantity - (find?.count || 0)}** more.`
      );
    }
	
    const useFunction = getUse(itemFind.name2);
    if(!useFunction) return sendError(interaction, "This item cannot be used yet!");
    if(!useFunction?.supportsQuantity && quantity !== 1) {
      quantity = 1;
    }
    
    if(useFunction.waitForSuccess) {
      const response = await useFunction.use(interaction, user, itemFind, quantity);
      if(response) {
        await removeItemFromUser(interaction.user.id, itemFind.name, quantity, user);
        return;
      }
    } else {
      await removeItemFromUser(interaction.user.id, itemFind.name, quantity, user);
      return useFunction.use(interaction, user, itemFind, quantity);
    }
  }
}
