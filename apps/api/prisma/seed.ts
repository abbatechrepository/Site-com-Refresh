import { PrismaClient } from "@prisma/client";

import { runBootstrapSeed } from "./seed/bootstrap";

const prisma = new PrismaClient();

async function main() {
  const result = await runBootstrapSeed(prisma);
  process.stdout.write(`Bootstrap concluido. Admin: ${result.adminEmail}\n`);
}

main()
  .catch(async (error) => {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
