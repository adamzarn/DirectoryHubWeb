//require dependencies
var PDFDocument = require ('pdfkit');
var blobStream  = require ('blob-stream');

function generatePDF(groupName, entries) {

	//create a document the same way as above
	doc = new PDFDocument

	//pipe the document to a blob
	stream = doc.pipe(blobStream())

	//add your content to the document here, as usual
	doc.text = groupName;
	doc.text = "A Simple Test";

	//get a blob when you're done
	doc.end()
	stream.on 'finish', ->
	  	//get a blob you can do whatever you like with
	  	blob = stream.toBlob(groupName + '.pdf')

	  	var link = document.createElement('a');
		link.href = url;
		link.download = groupName + '.pdf';
		link.dispatchEvent(new MouseEvent('click'));

}

