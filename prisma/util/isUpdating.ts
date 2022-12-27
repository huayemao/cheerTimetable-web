import prisma from '../../lib/prisma';

export async function isUpdating() {
  const count = await prisma.update.count({});
  const isUpdating = count > 1;
  return isUpdating;
}
