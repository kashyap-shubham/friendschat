import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { AuthUser } from "@/types/auth.types";

/*
|--------------------------------------------------------------------------
| Google OAuth Strategy
|--------------------------------------------------------------------------
*/
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      callbackURL: env.GOOGLE_CALLBACK_URL!,
    },

    async (_accessToken, _refreshToken, profile, done) => {

      try {

        const googleId = profile.id;

        const email = profile.emails?.[0]?.value;

        const name = profile.displayName;

        const image = profile.photos?.[0]?.value ?? null;

        if (!email) {

          return done(
            new Error("Google account has no email"),
            undefined
          );

        }

        let user = await prisma.user.findUnique({

          where: { googleId }

        });

        if (!user) {

          user = await prisma.user.create({

            data: {
              googleId,
              email,
              name,
              image
            }

          });

        }

        const sessionUser: AuthUser = {

          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image

        };

        return done(null, sessionUser);

      }

      catch (error) {

        return done(error as Error, undefined);

      }

    }
  )
);

/*
|--------------------------------------------------------------------------
| Serialize user id into session
|--------------------------------------------------------------------------
*/
passport.serializeUser((user, done) => {

  const sessionUser = user as AuthUser;

  done(null, sessionUser.id);

});

/*
|--------------------------------------------------------------------------
| Deserialize user from session id
|--------------------------------------------------------------------------
*/
passport.deserializeUser(

  async (id: string, done) => {

    try {

      const user = await prisma.user.findUnique({

        where: { id }

      });

      if (!user) {

        return done(null, false);

      }

      const sessionUser: AuthUser = {

        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image

      };

      done(null, sessionUser);

    }

    catch (error) {

      done(error as Error, null);

    }

  }

);

export default passport;