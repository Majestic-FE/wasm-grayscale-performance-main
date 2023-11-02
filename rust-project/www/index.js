// import * as wasm from "hello-wasm-pack";
import * as wasm from "rust-project";

// wasm.greet();
const button = document.getElementById("button");
const performanceBlock = document.getElementById("performance");
const averageUI = document.createElement("h2");
const standardDeviationUI = document.createElement("h2");
const array = [];
let total = 0;
let average = 0;
let count = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const [width, height] = [canvas.width, canvas.height];
performanceBlock.appendChild(averageUI);
performanceBlock.appendChild(standardDeviationUI);

button.addEventListener("click", (e) => {
  e.preventDefault();
  count += 1;
  convert();
});

function convert() {
  const img = new Image();
  img.src = "./yudai_abe.jpg";
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startTime = performance.now();
    const { v1, speed } = wasm.grayscale(width, height, data);
    const endTime = performance.now();
    console.log(`${count}回目の時間`, speed);

    const buffer = Uint8ClampedArray.from(v1);
    ctx.putImageData(new ImageData(buffer, width, height), 0, 0);
    // onPerformance(performance);
    onPerformance(endTime - startTime);
    onDrawing();
  };
}

function onPerformance(performance) {
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
