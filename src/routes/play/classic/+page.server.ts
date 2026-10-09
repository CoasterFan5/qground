import z from 'zod'
import { defaultProject } from './defaultProject.js'
import { placeables } from '#lib/gridItems/types.js'

export const load = async ({ url, platform }) => {

  const projectId = url.searchParams.get("project")

  if (!projectId) {
    return {
      project: defaultProject.items
    }
  }

  const projectData = await platform?.env.projectStorage.get(projectId)

  if (!projectData) {
    return {
      project: defaultProject.items
    }
  }

  const parsed = z.object({
    version: z.string(),
    items: z.array(z.object({
      type: z.enum(placeables),
      x: z.number(),
      y: z.number()
    }))
  }).safeParse(await projectData.text())

  if (parsed.error) {
    return {
      project: defaultProject.items
    }
  }

  return {
    project: parsed.data.items
  }
}
