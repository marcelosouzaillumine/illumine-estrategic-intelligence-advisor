const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
console.log('shapes:', !!pptx.shapes);
console.log('ShapeType:', !!pptx.ShapeType);
console.log('ShapeType.rect:', pptx.ShapeType && pptx.ShapeType.rect);
console.log('shapes.RECTANGLE:', pptx.shapes && pptx.shapes.RECTANGLE);
