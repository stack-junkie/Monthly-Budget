import { PRO_VERSION, SOURCE_CODE_URL } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export const headerLinks = [
  // Removed budget link - user wants it gone from header
];

const HeaderLinks = () => {
  // No header links needed - user requested removal
  return null;
};
export default HeaderLinks;
