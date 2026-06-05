const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
console.log('shapes:', !!pptx.shapes);
console.log('ShapeType:', !!pptx.ShapeType);
console.log('ShapeType.roundRect:', pptx.ShapeType && pptx.ShapeType.roundRect);
console.log('shapes.ROUNDED_RECTANGLE:', pptx.shapes && pptx.shapes.ROUNDED_RECTANGLE);
