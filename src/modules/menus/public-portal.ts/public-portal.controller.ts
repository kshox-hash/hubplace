import { Request, Response } from "express";
import { companyProfileService } from "../../profiles/company_profile.service";
import { findEnabledModulesByUserId } from "../user-modules.repository";
import { renderPublicPortalHtml } from "./public-portal.renderer";

type Params = {
  publicSlug: string;
};

export const publicPortalController = {
  async open(req: Request<Params>, res: Response): Promise<Response | void> {
    try {
      const { publicSlug } = req.params;

      if (!publicSlug || !publicSlug.trim()) {
        return res.status(400).send("Slug público obligatorio");
      }

      const profile = await companyProfileService.getByPublicSlug(publicSlug);

      if (!profile) {
        return res.status(404).send("Negocio no encontrado");
      }

      const modules = await findEnabledModulesByUserId(profile.user_id);

      const html = renderPublicPortalHtml({
        businessName: profile.business_name,
        title: profile.business_name,
        subtitle: "Selecciona un servicio para continuar.",
        modules,
      });

      return res.status(200).send(html);
    } catch (error) {
      console.error("Error abriendo portal público:", error);
      return res.status(500).send("Error abriendo portal público");
    }
  },
};