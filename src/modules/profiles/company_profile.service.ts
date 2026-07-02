import { companyProfileRepository } from "./company_profile_repository";
import {
  CompanyProfile,
  CompanyProfileInput,
} from "./company-profile.type";
import { geocodeAddress } from "./geocoding.service";

const getByUserId = async (userId: string): Promise<CompanyProfile | null> => {
  if (!userId || !userId.trim()) {
    throw new Error("userId es obligatorio");
  }

  return companyProfileRepository.getByUserId(userId.trim());
};

const getByPublicSlug = async (
  publicSlug: string,
): Promise<CompanyProfile | null> => {
  const slug = publicSlug.trim().toLowerCase();

  if (!slug) {
    throw new Error("publicSlug es obligatorio");
  }

  return companyProfileRepository.getByPublicSlug(slug);
};

function extractInstagramUsername(value?: string | null): string | null {
  const v = value?.trim();
  if (!v) return null;
  const m = v.match(/instagram\.com\/([^/?#\s]+)/i);
  if (m) return m[1];
  return v.replace(/^@/, "");
}

const upsert = async (
  input: CompanyProfileInput,
): Promise<CompanyProfile> => {
  if (!input.user_id || !input.user_id.trim()) {
    throw new Error("user_id es obligatorio");
  }

  if (!input.business_name || !input.business_name.trim()) {
    throw new Error("business_name es obligatorio");
  }

  const sanitizedInput: CompanyProfileInput = {
    user_id: input.user_id.trim(),
    business_name: input.business_name.trim(),
    rut: input.rut?.trim() ? input.rut.trim() : null,
    city: input.city?.trim() ?? "",
    address: input.address?.trim() ?? "",
    phone: input.phone?.trim() ?? "",
    brand_color: input.brand_color ?? null,
    description: input.description?.trim() || null,
    welcome_message: input.welcome_message?.trim() || null,
    instagram_url: extractInstagramUsername(input.instagram_url) || null,
    whatsapp_number: input.whatsapp_number?.replace(/\D/g, "") || null,
    business_hours: input.business_hours?.trim() || null,
    cover_image: input.cover_image ?? null,
  };

  const [prev, saved] = await Promise.all([
    companyProfileRepository.getByUserId(sanitizedInput.user_id),
    companyProfileRepository.upsert(sanitizedInput),
  ]);

  const addressChanged =
    (sanitizedInput.address ?? '') !== (prev?.address ?? '') ||
    (sanitizedInput.city ?? '') !== (prev?.city ?? '');

  if (addressChanged) {
    const query = [sanitizedInput.address, sanitizedInput.city].filter(Boolean).join(', ');
    if (query) {
      geocodeAddress(query).then((coords) => {
        if (coords) {
          companyProfileRepository.updateCoordinates(sanitizedInput.user_id, coords.lat, coords.lon).catch(() => {});
        }
      }).catch(() => {});
    }
  }

  return saved;
};

export const companyProfileService = {
  getByUserId,
  getByPublicSlug,
  upsert,
};