export const randomFirstWord = () => {
  const words = [
    "りんご",
    "いきもの",
    "さくら",
    "あめ",
    "しお",
    "おかね",
    "やきそば",
  ];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
