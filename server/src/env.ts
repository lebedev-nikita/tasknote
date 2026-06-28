import { z } from "zod";

export const env = getEnv();

function getEnv() {
  const EnvSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().int(),
    CLIENT_ORIGIN: z.url(),
  });

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(JSON.stringify(result.error.issues, null, 2));
    console.error(process.env);
    process.exit(1);
    throw new Error("Invalid server environment");
  }
  console.info(result.data);

  return result.data;
}
