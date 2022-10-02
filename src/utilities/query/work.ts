import { WorkModel } from "../../database/models/WORKMODEL";

export async function work(
    user: string,
    work: string,
    cd: number
): Promise<boolean | number>{

    let data = await WorkModel.findOne({ id: user });
    const cooldown = Date.now() + cd;

    if(!data){
        data = await WorkModel.create({
            id: user,
            artist: work == "artist" ? cooldown : 0,
            internetTroll: work == "internetTroll" ? cooldown : 0,
            discordModerator: work == "discordModerator" ? cooldown : 0,
            plumber: work == "plumber" ? cooldown : 0,
            chef: work == "chef" ? cooldown : 0,
            techSupport: work == "techSupport" ? cooldown : 0,
            goldDigger: work == "goldDigger" ? cooldown : 0,
            teacher: work == "teacher" ? cooldown : 0,
            rapper: work == "rapper" ? cooldown : 0,
            hacker: work == "hacker" ? cooldown : 0,
            influencer: work == "influencer" ? cooldown : 0,
            stripper: work == "stripper" ? cooldown : 0
        })
        return true;
    }

    else{
        if(data.get(work) > Date.now()){
            return data.get(work) - Date.now()
        }
        const obj = new Map<string, number>();
       obj.set(work, cooldown);

       await WorkModel.updateOne({
           id: user
           },
           obj)
    }

    return true;
}