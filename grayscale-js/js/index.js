const canvas = document.getElementById("canvas");
const imageUrl = document.getElementById("image").src;
const button = document.getElementById("button");
const performanceBlock = document.getElementById("performance");
const averageUI = document.createElement("h2");
const standardDeviationUI = document.createElement("h2");
const array = [];
let total = 0;
let average = 0;
let count = 0;

button.addEventListener("click", (e) => {
  e.preventDefault();
  count += 1;
  performanceBlock.appendChild(averageUI);
  performanceBlock.appendChild(standardDeviationUI);
  try {
    drawImage(imageUrl);
  } catch (error) {
    alert(error);
  }
});

const drawImage = async (url) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = url;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    ctx = canvas.getContext("2d");
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let dst = ctx.createImageData(canvas.width, canvas.height);

    const startTime = performance.now();
    for (let i = 0; i < src.data.length; i = i + 4) {
      const r = src.data[i];
      const g = src.data[i + 1];
      const b = src.data[i + 2];
      const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
      dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = gray;
      dst.data[i + 3] = src.data[i + 3];
    }
    const endTime = performance.now();
    console.log(`${count}回目の時間`, endTime - startTime, average);

    ctx.putImageData(dst, 0, 0);
    onPerformance(startTime, endTime);
    onDrawing();
  };
};

function onPerformance(start, end) {
  const performance = end - start;
  total += performance;
  array.push(performance);
  average = total / count;
}

function onDrawing() {
  const standardDeviation = fetchStandardDeviation();
  averageUI.innerHTML = total / count;
  standardDeviationUI.innerHTML = standardDeviation;
}

function fetchStandardDeviation() {
  const standardDeviation = Math.sqrt(
    array
      .map((current) => {
        // 各要素について
        let difference = current - average; // 平均値との差を求める
        return difference ** 2; // 差を2乘する
      })
      .reduce(
        (previous, current) => previous + current // 差の2乗をすべて足す
      ) / count // 差の2乗の平均が分散
  );

  return standardDeviation;
}
