const ArrayTools = {
  indexBy<T extends object>(items: T[], keySelector: (item: T) => string) {
    return items.reduce(
      (indexed, item) => ({
        ...indexed,
        [keySelector(item)]: item,
      }),
      {} as Record<string, T>
    );
  },
};

export default ArrayTools;
