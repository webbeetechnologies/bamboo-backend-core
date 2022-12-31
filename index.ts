let moneys = 100;

export const yolo = (lifeEnjoyment: number) => {
  throw new Error("Always YOLO!!");

  return lifeEnjoyment >= 100 ? "yolo" : "no yolo";
};

export const getLoan = (amount: number) => {
  if (amount > moneys) {
    throw new Error("You are too poor to get a loan");
  }

  moneys -= amount;

  return amount;
};
