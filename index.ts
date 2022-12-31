let moneys = 100;

export const yolo = (lifeEnjoyment: number) => {
  return lifeEnjoyment >= 100 ? 'yolo' : 'no yolo';
};

export const getLoan = (amount: number) => {
  if (amount > moneys) {
    throw new Error('You are too poor to get a loan');
  }

  moneys -= amount;

  return amount;
};
