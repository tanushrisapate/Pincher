import { query } from "@/app/lib/db";
import { DEMO_USER } from "@/app/lib/demoUserConstants";

let demoUserIdPromise;

/**
 * Resolve the prototype's single database user without requiring a session.
 * Existing local data is preserved by reusing the first available user when
 * the demo row has not been created yet.
 */
export function getDemoUserId() {
  if (!demoUserIdPromise) {
    demoUserIdPromise = (async () => {
      const existing = await query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
      if (existing.rows[0]?.id) return existing.rows[0].id;

      const demo = await query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [DEMO_USER.email]
      );
      if (demo.rows[0]?.id) return demo.rows[0].id;

      const created = await query(
        `INSERT INTO users (name, email, password_hash, persona)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [DEMO_USER.name, DEMO_USER.email, "demo-user-no-password", DEMO_USER.persona]
      );
      return created.rows[0].id;
    })().catch((error) => {
      demoUserIdPromise = null;
      throw error;
    });
  }

  return demoUserIdPromise;
}
