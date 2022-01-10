import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  let noah = await db.user.findFirst({
    where: {
      address: "0xC90C74fAC03a1Fd3D43aC94418019901F6a8Dd56",
    },
  });
  if (!noah) {
    noah = await db.user.create({
      data: {
        address: "0xC90C74fAC03a1Fd3D43aC94418019901F6a8Dd56",
        nonce: Math.floor(Math.random() * 10000000),
      },
    });
  }
  await Promise.all(
    getPosts().map((post) => {
      const data = { authorId: noah?.id, ...post };
      return db.post.create({ data });
    })
  );
}
seed();

function getPosts() {
  return [
    {
      title: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
      slug: "road-worker",
    },
    {
      title: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
      slug: "frisbee",
    },
    {
      title: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
      slug: "",
    },
    {
      title: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
      slug: "skeletons",
    },
    {
      title: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
      slug: "hippos",
    },
    {
      title: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
      slug: "dinner",
    },
    {
      title: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
      slug: "elevator",
    },
  ];
}
