import { Request, Response } from "express";
import { getSlugByValueService } from "../../slug/slug.service";
import { quoteHtml } from "../../quotes/quote-html";
import { getProductsRepository, getActiveProductsRepository } from "../../quotes/products/products.repository";
import { companyProfileRepository } from "../../profiles/company_profile_repository";
import { findEnabledModulesByUserId } from "../user-modules.repository";
import { renderPortalHtml } from "./portal.screen";
import { StatisticsService } from "../../stadistics/stadistics.service";
import { isBot, shouldCountVisit } from "../../stadistics/visit-tracker";
import { ReviewsRepository } from "../../stadistics/reviews.repository";

const statsService  = new StatisticsService();
const reviewsRepo   = new ReviewsRepository();




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

      // Redirigir a login si Google auth está activo y no hay sesión de portal
      let portalUser: { name?: string; email?: string; picture?: string } | null = null;
      if (process.env.GOOGLE_CLIENT_ID) {
        const jwt = await import("jsonwebtoken");
        const token: string | undefined = req.cookies?.["portal_session"];
        if (!token) {
          return res.redirect("/auth/portal/" + encodeURIComponent(publicSlug) + "/google");
        }
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET!, { issuer: "portal" }) as any;
          portalUser = { name: payload.name, email: payload.email, picture: payload.picture };
        } catch {
          res.clearCookie("portal_session");
          return res.redirect("/auth/portal/" + encodeURIComponent(publicSlug) + "/google");
        }
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
        portalUser: portalUser ?? null,
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

      const { rating, comment } = req.body || {};
      const r = Number(rating);
      if (!r || r < 1 || r > 5) {
        return res.status(400).json({ ok: false, message: "Calificación inválida (1-5)." });
      }

      const portalUser = (req as any).portalUser as { name?: string; email?: string; picture?: string } | undefined;

      await reviewsRepo.create(
        slug.user_id, r,
        comment?.trim() || null,
        portalUser?.name ?? null,
        null,
        portalUser?.name ?? null,
        portalUser?.email ?? null,
        portalUser?.picture ?? null,
      );

      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e.message });
    }
  },
};