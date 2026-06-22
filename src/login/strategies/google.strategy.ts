import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import DB from "../../db/db_configuration";

if (process.env.GOOGLE_CLIENT_ID) passport.use(
  new GoogleStrategy(
    {
      clientID:        process.env.GOOGLE_CLIENT_ID    as string,
      clientSecret:    process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:     process.env.GOOGLE_CALLBACK_URL  as string,
      passReqToCallback: true,
    } as any,
    async (req: any, _accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const email   = profile.emails?.[0]?.value;
        const name    = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        // flujo portal: state = "portal:<slug>"
        const rawState = (req.query?.state as string) || "";
        if (rawState.startsWith("portal:")) {
          const slug = rawState.slice(7);
          return done(null, { __type: "portal", slug, name, email, picture });
        }

        if (!email) {
          return done(new Error("Google no devolvió correo"));
        }

        const pool = DB.getPool();

        let result = await pool.query(
          `
          SELECT id, email
          FROM users
          WHERE lower(email) = lower($1)
          LIMIT 1
          `,
          [email]
        );

        let user = result.rows[0];

        if (!user) {
          result = await pool.query(
            `
            INSERT INTO users (
              email,
              password
            )
            VALUES (
              $1,
              $2
            )
            RETURNING id, email
            `,
            [email, null]
          );

          user = result.rows[0];
        }

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );

        return done(null, {
          token,
          user: {
            id: user.id,
            email: user.email,
            name,
            picture,
          },
        });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export {};