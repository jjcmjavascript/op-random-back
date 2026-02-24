import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@shared/services/logger.service';
import { chromium } from 'playwright';

@Injectable()
export class GetUrlFromOriginService {
  private readonly logger = new Logger(GetUrlFromOriginService.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(): Promise<Set<string>> {
    const urls = new Set<string>();

    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      page.on('request', (req) => {
        const url: string = req.url();
        if (
          url.includes(this.configService.get<string>('ranking_url_to_find')!)
        ) {
          urls.add(url);
        }
      });

      await page.goto(this.configService.get<string>('ranking_url')!, {
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
