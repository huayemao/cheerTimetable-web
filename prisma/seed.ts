import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

async function run() {
  await seedEntities()
  // await seedRelations()
}

run()
