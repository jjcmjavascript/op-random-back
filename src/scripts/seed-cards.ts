import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

// Definimos la interfaz (igual que antes)
type RawCard = {
  id: string;
  pack_id: string | number; // Aceptamos ambos para luego convertir
  name: string;
  rarity: string;
  category: string;
  img_url?: string | null;
  img_full_url?: string | null;
  colors?: string[];
  cost?: number | null;
  attributes?: string[];
  power?: number | null;
  counter?: number | null;
  types?: string[];
  effect?: string | null;
  trigger?: string | null;
  finalUrl?: string | null;
};

const prisma = new PrismaClient();
const cardsRoot = path.resolve(__dirname, '../assets/cards');
const BATCH_SIZE = 100; // Prisma recomienda tamaños de lote moderados para transacciones

function getExpansion(cardId: string): string {
  const trimmed = cardId.trim();
  if (!trimmed) return 'unknown'; // Fallback seguro en vez de error

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('p-')) return 'promo';

  const parts = trimmed.split('-');
  // Validación extra por si el ID no tiene guión
  return parts.length > 0 ? parts[0].toLowerCase() : 'unknown';
}

// Función recursiva optimizada (generator) para no cargar todas las rutas en memoria
async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else if (dirent.isFile() && dirent.name.endsWith('.json')) {
      yield res;
    }
  }
}

async function main() {
  console.log('🚀 Starting import...');

  let buffer: RawCard[] = [];
  let totalProcessed = 0;

  // 1. Lectura eficiente: Procesamos archivo por archivo
  for await (const filePath of getFiles(cardsRoot)) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content) as RawCard[];

      // Validación básica de array
      if (Array.isArray(parsed)) {
        buffer.push(...parsed);
      }

      // 2. Procesamiento en lotes cuando el buffer se llena
      if (buffer.length >= BATCH_SIZE) {
        await processBatch(buffer);
        totalProcessed += buffer.length;
        buffer = []; // Limpiar memoria
        console.log(`📦 Processed ${totalProcessed} cards...`);
      }
    } catch (err) {
      console.error(`❌ Error reading file ${filePath}:`, err);
    }
  }

  // 3. Procesar el remanente final
  if (buffer.length > 0) {
    await processBatch(buffer);
    totalProcessed += buffer.length;
  }

  console.log(`✅ Done! Total cards processed: ${totalProcessed}`);
}

async function processBatch(rawCards: RawCard[]) {
  // Preparamos los datos transformados
  const operations = rawCards
    .map((card) => {
      // Validación silenciosa: saltar cartas sin ID en lugar de crashear todo el script
      if (!card.id || !card.pack_id) {
        console.warn(`⚠️ Skipping invalid card: ${card.id || 'NO_ID'}`);
        return null;
      }

      const finalUrl = card.finalUrl ?? null;
      const smallImgUrl = finalUrl
        ? finalUrl.replace('.webp', '-small.webp')
        : (card.img_url ?? null);

      const dataPayload = {
        packId: String(card.pack_id),
        name: card.name,
        expansion: getExpansion(card.id),
        rarity: card.rarity,
        category: card.category,
        imgUrl: smallImgUrl,
        imgFullUrl: finalUrl,
        colors: card.colors ?? [],
        cost: card.cost ?? null,
        attributes: card.attributes ?? [],
        power: card.power ?? null,
        counter: card.counter ?? null,
        types: card.types ?? [],
        effect: card.effect ?? '-',
        trigger: card.trigger ?? null,
      };

      // Usamos UPSERT: Crea si no existe, actualiza si existe.
      return prisma.card.upsert({
        where: { cardId: card.id },
        create: {
          cardId: card.id,
          ...dataPayload,
        },
        update: dataPayload,
      });
    })
    .filter((op): op is any => op !== null); // Eliminar nulos

  if (operations.length === 0) return;

  // Ejecutamos todas las operaciones del lote en UNA sola transacción
  // Esto es muchísimo más rápido que el bucle for-await anterior
  await prisma.$transaction(operations);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error('Error disconnecting Prisma client:', e);
    });
  });
