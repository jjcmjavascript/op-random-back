import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app/app.module';
import { RankingInsertService } from '../modules/ranking/services/ranking-insert.service';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicación...');

    // Crear el contexto de la aplicación sin iniciar el servidor
    const app = await NestFactory.createApplicationContext(AppModule);

    // Obtener el servicio
    const rankingInsertService = app.get(RankingInsertService);

    console.log('📊 Ejecutando inserción de ranking...');
    const result = await rankingInsertService.execute();

    console.log('✅ Ranking insertado exitosamente:');
    console.table(result);

    // Cerrar la aplicación
    await app.close();

    console.log('👋 Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar el script:', error);
    process.exit(1);
  }
}

bootstrap();
