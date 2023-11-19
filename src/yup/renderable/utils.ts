export const renderLazy = (schema: string): string => {
  return `yup.lazy(() => ${schema})`;
};
