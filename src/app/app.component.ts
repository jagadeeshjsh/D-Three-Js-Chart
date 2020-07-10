import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'd3-chart';

  @ViewChild('exportSVGtoPDF', {static: false}) exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('render') render: ElementRef;
  ngOnInit(){
    // Create a new directed graph
var g = new dagreD3.graphlib.Graph().setGraph({});

// States and transitions from RFC 793
var states = [ "START", "Vendor Create Invoice", "Scan Voice", "Entern SAP",
                "Book Invoice", "Clear Invoice", "Due Date Passed",
                "Change Baseline Date", "Cancel Invoice Receipt", "END"];

// Automatically label each of the nodes
states.forEach(function(state) { g.setNode(state, { label: state }); });


states.forEach(function(state) {console.log('state', state)
  if(state == 'START' || state == 'END' ){
    g.setNode(state, { shape: "circle", label: state }); 
  }
   else{
    g.setNode(state, { shape: "rect" ,label: state }); 
   }
  });
// Set up the edges


g.setEdge("START",     "Vendor Create Invoice", { label: "195", style: "stroke: #333; stroke-width: 3px; stroke-dasharray: 5, 5;",
arrowheadStyle: "fill: #333"});
g.setEdge("Vendor Create Invoice",     "Scan Voice",   { label: "145", style: "stroke: #333; stroke-width: 3px;",
arrowheadStyle: "fill: #333" });
g.setEdge("Scan Voice",     "Entern SAP",   { label: "194",  style: "stroke: #333; stroke-width: 3px;",
arrowheadStyle: "fill: #333"});
g.setEdge("Entern SAP",     "Book Invoice",     { label: "76" });
g.setEdge("Book Invoice",   "Clear Invoice",  { label: "106" , style: "stroke: #333; stroke-width: 3px;",
arrowheadStyle: "fill: #333" });
g.setEdge("Clear Invoice",   "Due Date Passed",      { label: "130", style: "stroke: #333; stroke-width: 3px;",
arrowheadStyle: "fill: #333"  });
g.setEdge("Entern SAP",   "Clear Invoice",   { label: "20" });
g.setEdge("Book Invoice",   "Change Baseline Date",      { label: "55" });
g.setEdge("Book Invoice",   "Cancel Invoice Receipt",     { label: "15" });
g.setEdge("Cancel Invoice Receipt",      "END",  { label: "15", style: "stroke: #333; stroke-width: 1.8px; stroke-dasharray: 5, 5;",
arrowheadStyle: "fill: #fff" });
g.setEdge("Book Invoice",      "END",  { label: "20", style: "stroke: #333; stroke-width: 1.8px; stroke-dasharray: 5, 5;",
arrowheadStyle: "fill: #fff" });
g.setEdge("Clear Invoice",   "END",      { label: "50", style: "stroke: #333; stroke-width: 1.8px; stroke-dasharray: 5, 5;",
arrowheadStyle: "fill: #fff" });
g.setEdge("Due Date Passed",   "END",      { label: "110", style: "stroke: #333; stroke-width: 3px; stroke-dasharray: 5, 5;",
arrowheadStyle: "fill: #333" });
g.setEdge("Clear Invoice",   "Vendor Create Invoice",      { label: "1" });
g.setEdge("Due Date Passed",   "Scan Voice",      { label: "51" });
g.setEdge("Due Date Passed",   "Book Invoice",      { label: "20" });
g.setEdge("Change Baseline Date",   "Clear Invoice",      { label: "55" });


// Set some general styles
g.nodes().forEach(function(v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
});

// Add some custom colors based on state
g.node('START').style = "fill: #7f7";
g.node('END').style = "fill: #f77";

var svg = d3.select("svg")
.attr('height', 500)
.attr('width', 900),
    inner = svg.append("g");
    

// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });
// svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var initialScale = 0.75;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

svg.attr('height', g.graph().height * initialScale + 40);


  }
  exportSVG(fileType){
    html2canvas(this.exportSVGtoPDF.nativeElement, { useCORS: true, foreignObjectRendering: true, allowTaint: true }).then(canvas => {
      console.log('canvas.height',canvas.height)
      console.log('canvas.height',canvas.width)
      var margin = 10;
      var imgWidth = 210 - 2*margin; 
      var pageHeight = 295;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var position = 10;
   
      if(fileType == 'png' || fileType == 'jpeg'){
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/'+fileType);
        this.downloadLink.nativeElement.download = 'marble-diagram.'+fileType;
        this.downloadLink.nativeElement.click();
      }
      if(fileType == 'pdf'){
        var contentDataURL = canvas.toDataURL("image/png");
        var doc = new jsPDF();
        doc.addImage(contentDataURL, 'PNG', margin, position,380, 200);
        // doc.addImage(img,'PNG',7, 5, 300, 180);
        doc.save('postres.pdf');
     
      }
      
   
    });
  }
}




