const getFieldSchemaName = (name: string = ''): string => {
  let clearedName = name.replace(/\[\d+\]/g, '');

  if (/\.?([^.]+)$/.test(clearedName)) {
    clearedName = RegExp.$1;
  }

  return clearedName;
};

export { getFieldSchemaName };
