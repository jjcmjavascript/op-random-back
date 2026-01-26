export const randomSort = (allCards: unknown[]) => {
  return allCards
    .sort(() => Math.random() - 0.5)
    .sort(() => Math.random() - 0.5);
};

export const getUniqueByExpansion = (
  allCards: { cardId: string; expansion: string }[],
) => {
  const unique = new Set<string>();
  const uniqueCards: typeof allCards = [];

  for (const card of allCards) {
    const [expansion, rawCode] = card.cardId.split('-');
    const [code] = rawCode.split('_');
    const uniqueKey = `${expansion}-${code}`;

    if (!unique.has(uniqueKey)) {
      unique.add(uniqueKey);
      uniqueCards.push(card);
    }
  }

  return uniqueCards;
};

export const getNCards = ({ n, cards }: { n: number; cards: unknown[] }) => {
  return cards.slice(0, n);
};

export const toArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null) return undefined;

  if (Array.isArray(value)) return value as unknown[];

  if (typeof value === 'string')
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  return [value];
};

export const forceToArray = <T>(value: unknown) => {
  const arr = toArray({ value }) ?? [];

  return arr as T[];
};

export const filterByArchetype = ({
  cards,
  archetypes,
}: {
  cards: { types: string[] }[];
  archetypes: string[];
}) => {
  if (Array.isArray(archetypes) && archetypes.length > 0) {
    return cards.filter((card) =>
      card.types.some((archetype) => archetypes.includes(archetype)),
    );
  }

  return cards;
};
