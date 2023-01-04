let moneys = 100;

/**
 * This function will determine whether you enjoy your life and if so, return 'yolo' and if not, return 'no yolo'
 *
 * @param lifeEnjoyment - How much you enjoy life
 */
export const yolo = (lifeEnjoyment: number) => {
  return lifeEnjoyment >= 100 ? 'yolo' : 'no yolo';
};


/**
 * With this function, you can get a loan of any amount. It has a very sophisticated algorithm that will determine whether you are eligible for a loan or not.
 *
 *
 * @param amount - The amount of money you want to get
 */
export const getLoan = (amount: number) => {
  if (amount > moneys) {
    throw new Error('You are too poor to get a loan');
  }

  moneys -= amount;

  return amount;
};
