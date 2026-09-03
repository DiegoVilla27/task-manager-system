import { apiConfig } from "./lintstaged/api.js";
import { backofficeConfig } from "./lintstaged/backoffice.js";
import { clientConfig } from "./lintstaged/client.js";

export default {
  ...clientConfig,
  ...backofficeConfig,
  ...apiConfig
};
