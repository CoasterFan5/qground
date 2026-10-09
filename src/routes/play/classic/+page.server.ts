import type { PageServerLoad } from './$types.js'
import { defaultProject } from './defaultProject.js'
import { projectZodObject } from './zodObjects.js'
import { env } from "cloudflare:workers"

export const load: PageServerLoad = async ({ url }) => {


  const projectId = url.searchParams.get("project")

  if (!projectId) {
    return {
      project: defaultProject.items
    }
  }



  const projectData = await env.projectStorage.get(projectId)

  if (!projectData) {
    return {
      project: defaultProject.items
    }
  }

  const parsed = projectZodObject.safeParse(await projectData.json())

  if (parsed.error) {
    console.error(parsed.error)
    return {
      project: defaultProject.items
    }
  }

  return {
    project: parsed.data.items
  }
}
