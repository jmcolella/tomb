function convertStringToEnum<T>(value: string, enumList: T[]): T {
  const enumValue = enumList.find((enumItem) => enumItem === value);

  if (!enumValue) {
    throw new Error(`Invalid value: ${value}`);
  }

  return enumValue;
}

export default convertStringToEnum;
