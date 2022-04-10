import { clearStorage } from './clear'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

async function run() {
  // await clearStorage()
  await seedEntities()
  await seedRelations()
}

run()
