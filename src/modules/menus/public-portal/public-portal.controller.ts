import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getSlugByValueService } from "../../slug/slug.service";
import { quoteHtml } from "../../quotes/quote-html";
import { getProductsRepository, getActiveProductsRepository } from "../../quotes/products/products.repository";
import { companyProfileRepository } from "../../profiles/company_profile_repository";
import { findEnabledModulesByUserId } from "../user-modules.repository";
import { renderPortalHtml } from "./portal.screen";
import { StatisticsService } from "../../stadistics/stadistics.service";
import { isBot, shouldCountVisit } from "../../stadistics/visit-tracker";
import { ReviewsRepository } from "../../stadistics/reviews.repository";
import { OAuth2Client } from "google-auth-library";

const statsService  = new StatisticsService();
const reviewsRepo   = new ReviewsRepository();
const googleClient  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




type Params = {
  publicSlug: string;
}; 


export const publicPortalController = {

  async openQuotes(req : Request<Params>, res: Response) : Promise<Response | void>{

    try{
          const { publicSlug } = req.params;

      if (!publicSlug || !publicSlug.trim()) {
        return res.status(400).send("Slug público obligatorio");
      }
      
      //GET SLUG TO CHEK IF SHOP EXIST
      const slug = await getSlugByValueService(publicSlug);

      if (!slug) {
        return res.status(404).send("Negocio no encontrado");
      }


      const products = await getProductsRepository(slug.user_id);

        const html = quoteHtml({
          brand: slug.business_name,
          title: slug.business_name,
          subTitle: "Selecciona un servicio para continuar.",
          products: products,
          publicSlug: publicSlug  
        });

      return res.status(200).send(html);

    }catch(error){
     
      return res.status(500).send("Error opening QuotesView");
    }
  },
  

  async open(req: Request<Params>, res: Response): Promise<Response | void> {
    try {
      const { publicSlug } = req.params;

      if (!publicSlug || !publicSlug.trim()) {
        return res.status(400).send("Slug público obligatorio");
      }

      const slug = await getSlugByValueService(publicSlug);

      if (!slug) {
        return res.status(404).send("Negocio no encontrado");
      }

      const [products, profile, enabledModules] = await Promise.all([
        getActiveProductsRepository(slug.user_id),
        companyProfileRepository.getByUserId(slug.user_id),
        findEnabledModulesByUserId(slug.user_id),
      ]);

      const html = renderPortalHtml({
        businessName:   slug.business_name ?? publicSlug,
        publicSlug,
        userId:         slug.user_id,
        productCount:   products.length,
        phone:          profile?.phone           ?? null,
        address:        profile?.address         ?? null,
        city:           profile?.city            ?? null,
        brandColor:     profile?.brand_color     ?? null,
        description:    profile?.description     ?? null,
        welcomeMessage: profile?.welcome_message ?? null,
        instagramUrl:   profile?.instagram_url   ?? null,
        whatsappNumber: profile?.whatsapp_number ?? null,
        businessHours:  profile?.business_hours  ?? null,
        enabledModules,
        products: products.map((p: any) => ({
          id:          String(p.id),
          name:        String(p.name || ""),
          price:       Number(p.price || 0),
          description: p.description ?? null,
        })),
        googleClientId: process.env.GOOGLE_CLIENT_ID ?? null,
      });

      const ip = req.ip ?? req.socket?.remoteAddress ?? "";
      const ua = req.headers["user-agent"];
      if (!isBot(ua) && shouldCountVisit(ip, slug.user_id)) {
        statsService.increment(slug.user_id, "link_opens").catch(() => {});
      }

      return res.status(200).send(html);

    } catch (error) {
      return res.status(500).send("Error abriendo portal público");
    }
  },

  async submitReview(req: Request, res: Response): Promise<Response> {
    try {
      const slug = await getSlugByValueService(String(req.params["publicSlug"]));
      if (!slug) return res.status(404).json({ ok: false, message: "Negocio no encontrado." });

      const { rating, clientName, comment, googleCredential } = req.body || {};
      const r = Number(rating);
      if (!r || r < 1 || r > 5) {
        return res.status(400).json({ ok: false, message: "Calificación inválida (1-5)." });
      }

      let googleName: string | null = null;
      let googleEmail: string | null = null;
      let googleAvatarUrl: string | null = null;

      if (googleCredential) {
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: googleCredential,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          if (payload) {
            googleName      = payload.name       ?? null;
            googleEmail     = payload.email      ?? null;
            googleAvatarUrl = payload.picture    ?? null;
          }
        } catch {
          // token inválido — ignorar y guardar como anónimo
        }
      }

      await reviewsRepo.create(
        slug.user_id, r,
        comment?.trim() || null,
        (googleName ?? clientName?.trim()) || null,
        null,
        googleName, googleEmail, googleAvatarUrl,
      );

      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e.message });
    }
  },

  async portalSignIn(req: Request, res: Response): Promise<Response> {
    try {
      const { googleCredential } = req.body || {};
      if (!googleCredential) {
        return res.status(400).json({ ok: false, message: "Credencial requerida." });
      }
      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ ok: false, message: "Google auth no configurado." });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        return res.status(401).json({ ok: false, message: "Token inválido." });
      }

      const token = jwt.sign(
        { email: payload.email, name: payload.name ?? "", picture: payload.picture ?? "" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d", issuer: "portal" },
      );

      return res.json({ ok: true, token });
    } catch {
      return res.status(401).json({ ok: false, message: "Error de autenticación." });
    }
  },
};