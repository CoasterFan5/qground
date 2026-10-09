import { command } from "$app/server";
import crypto from "crypto"
import { projectZodObject } from "./zodObjects";
import { error } from "@sveltejs/kit";
import { env } from "cloudflare:workers"


export const saveProject = command(projectZodObject, async (projectItem) => {
  const id = crypto.randomBytes(32).toString("base64url")


  const projectString = JSON.stringify(projectItem)
  const byteSize = new TextEncoder().encode(projectString).byteLength

  if (byteSize > 1_000_000) {
    throw error(500, "File too large")
  }

  try {
    await env.projectStorage.put(id, projectString)

    return {
      success: true,
      message: id,
    }
  } catch (e) {
    console.error(e)
    throw error(500, "Something went wrong")
  }


})
