import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(rootDir, "index.html"),
        apartamenty: resolve(rootDir, "apartamenty.html"),
        lokalizacja: resolve(rootDir, "lokalizacja.html"),
        opinie: resolve(rootDir, "opinie.html"),
        faq: resolve(rootDir, "faq.html"),
        galeria: resolve(rootDir, "galeria.html"),
        kontakt: resolve(rootDir, "kontakt.html"),
        aktualnosci: resolve(rootDir, "aktualnosci.html"),
        poranekBliskoNatury: resolve(rootDir, "poranek-blisko-natury-nosal-kuznice.html"),
        zakopaneDeszczPremium: resolve(rootDir, "zakopane-deszcz-pod-dachem-premium.html"),
        gdzieZjescZakopane: resolve(rootDir, "gdzie-zjesc-zakopane-bez-tlumow.html"),
        romantycznyWeekend: resolve(rootDir, "romantyczny-weekend-zakopane-dla-dwojga.html"),
        termyPodhale: resolve(rootDir, "termy-podhale-po-gorach.html"),
        apartamentCzyHotel: resolve(rootDir, "apartament-czy-hotel-zakopane.html"),
        udogodnienia: resolve(rootDir, "udogodnienia.html"),
        noclegiPrzyNosalu: resolve(rootDir, "noclegi-przy-nosalu.html")
      }
    }
  }
});
