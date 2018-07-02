// @flow
const getFieldSchemaName = (name: string): string => {
  let clearedName = name.replace(/\[\d+\]/g, '');

  if (/\.?([^.]+)$/.test(clearedName)) {
    // $FlowFixMe
    clearedName = RegExp.$1;
  }

  return clearedName;
};

export { getFieldSchemaName };
