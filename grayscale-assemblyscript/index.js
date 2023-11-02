const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const [width, height] = [canvas.width, canvas.height];
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

  const img = new Image();
  img.src = "./yudai_abe.jpg";
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const arraySize = (width * height * 4) >>> 0;
    const nPages = ((arraySize + 0xffff) & ~0xffff) >>> 16;
    const startTime = performance.now();
    const memory = new WebAssembly.Memory({ initial: nPages });

    WebAssembly.instantiateStreaming(fetch("./build/optimized.wasm"), {
      env: {
        memory, // npm run asbuild:optimized -- --importMemory
        abort: (_msg, _file, line, column) =>
          console.error(`Abort at ${line}:${column}`),
        seed: () => new Date().getTime(),
      },
    }).then(({ instance }) => {
      // load bytes into memory
      const bytes = new Uint8ClampedArray(memory.buffer);

      for (let i = 0; i < data.length; i++) bytes[i] = data[i];

      instance.exports.convertToGrayscale(width, height, 80);

      // load data from memory
      for (let i = 0; i < data.length; i++) data[i] = bytes[i];

      const endTime = performance.now();
      console.log(`${count}回目の時間`, endTime - startTime, average);
      ctx.putImageData(imageData, 0, 0);
      onPerformance(startTime, endTime);
      onDrawing();
    });
  };
});

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
