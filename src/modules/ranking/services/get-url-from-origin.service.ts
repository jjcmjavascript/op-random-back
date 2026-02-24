import { ConfigService } from '@nestjs/config';
import { Logger } from '@shared/services/logger.service';
import { chromium } from 'playwright';

export class GetUrlFromOriginService {
  private readonly logger = new Logger(GetUrlFromOriginService.name);

  constructor(private readonly configService: ConfigService) {}
  async execute(): Promise<Set<string>> {
    const urls = new Set<string>();

    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      page.on('request', (req) => {
        const url = req.url();
        console.log('[REQUEST]', url);
        if (url.includes('cdn.cardkaizoku.com/stats/')) {
          urls.add(url);
          console.log('[STATS URL]', url);
        }
      });

      await page.goto(this.configService.get<string>('RANKING_URL')!, {
        waitUntil: 'networkidle',
      });

      // espera extra por si cargan cosas tardías
      await page.waitForTimeout(5000);

      await browser.close();
    } catch (error) {
      this.logger.error('Error al obtener URLs de origen', error);
    }

    return urls;
  }
}
