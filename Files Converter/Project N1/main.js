const fileInput = document.getElementById("fileInput");
const fileNameSpan = document.getElementById("fileName");
const fileInfo = document.getElementById("fileInfo");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const downloadLink = document.getElementById("downloadLink");

fileInput.addEventListener("change", handleFileSelect);

document
  .getElementById("pdfToPng")
  .addEventListener("click", () => convertFile("pdfToPng"));
document
  .getElementById("pngToJpg")
  .addEventListener("click", () => convertFile("pngToJpg"));
document
  .getElementById("jpgToPdf")
  .addEventListener("click", () => convertFile("jpgToPdf"));

let selectedFile;

function handleFileSelect(event) {
  selectedFile = event.target.files[0];
  fileNameSpan.textContent = selectedFile.name;
  fileInfo.classList.remove("hidden");
}

async function convertFile(conversionType) {
  if (!selectedFile) {
    alert("Please select a file first.");
    return;
  }

  loader.classList.remove("hidden");
  result.classList.add("hidden");

  let convertedBlob;

  switch (conversionType) {
    case "pdfToPng":
      convertedBlob = await convertPdfToPng(selectedFile);
      break;
    case "pngToJpg":
      convertedBlob = await convertPngToJpg(selectedFile);
      break;
    case "jpgToPdf":
      convertedBlob = await convertJpgToPdf(selectedFile);
      break;
  }

  loader.classList.add("hidden");
  result.classList.remove("hidden");
  downloadLink.classList.remove("hidden");

  const url = URL.createObjectURL(convertedBlob);
  downloadLink.href = url;
  downloadLink.download = `converted.${conversionType
    .split("To")[1]
    .toLowerCase()}`;
}
async function convertPdfToPng(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext).promise;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  }, "image/png");
}

async function convertPngToJpg(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg");
  });
}

async function convertJpgToPdf(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([img.width, img.height]);
  const jpgImage = await pdfDoc.embedJpg(await file.arrayBuffer());
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: img.width,
    height: img.height,
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}