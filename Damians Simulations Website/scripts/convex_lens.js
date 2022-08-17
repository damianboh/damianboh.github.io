/********
    Copyright 2017, Simulations and Website Template by Damian Boh
    This work by Damian Boh is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
	Please visit http://creativecommons.org/licenses/by-nc-sa/4.0/ for more information.
********/
    
		var theCanvas = document.getElementById("theCanvas");   // for drawing the projectile
        var theContext = theCanvas.getContext("2d");
        var trailCanvas = document.getElementById("trailCanvas");   // for drawing trails
        var trailContext = trailCanvas.getContext("2d");
		var ip_f = document.getElementById("ip_f");
		var ip_u = document.getElementById("ip_u");
		var ip_v = document.getElementById("ip_v");
		var ip_h_object = document.getElementById("ip_h_object");
		var ip_h_image = document.getElementById("ip_h_image");
		
		var f, u, v, h_object, h_image, magnification;
		
		var fraction_u, fraction_f, fraction_v; // used to scale drawing to canvas
		var width_scale_factor = 0.9;
		var height_scale_factor = 0.8;
		var fraction_h_image, fraction_h_object;
  
		
		var checkbox1 = document.getElementById("checkbox1");
			
		var device_size = document.getElementById("device_size"); // for debugging only
		
		var display_calculated_values = document.getElementById("display_calculated_values");
		var description = document.getElementById("description");
		var application_examples = document.getElementById("application_examples");
		var form_table = document.getElementById("form_table");
		var zoom_scaling = document.getElementById("zoom_scaling");
		var horizontal_zoom = document.getElementById("horizontal_zoom");
		var vertical_zoom = document.getElementById("vertical_zoom");
		var both_zoom = document.getElementById("both_zoom");
		var initial_instructions = document.getElementById("initial_instructions");
		
		// for drawing graphs
		var xPadding = 60; // space for axis and labels
        var yPadding = 30;
		var x_offset = 20;
		var y_offset = 20;
		
		var ray_colour = 'red';
		var text_colour = 'black';

		checkbox1.checked = false;
		resizeCanvas();
		
		resetAll();
		zoom_scaling.style.display ="none";
		
		device_size.innerHTML="Device width: " + window.innerWidth + ", height: " + window.innerHeight; // for debugging
		
		var x_pos, y_pos; // to read mouse or touch position on canvas when dragging object
		

		
		function resizeCanvas(){
			if (window.innerWidth<550){
				theCanvas.width=0.98*window.innerWidth;
				trailCanvas.width=0.98*window.innerWidth;
			}
			else {
				theCanvas.width=550;
				trailCanvas.width=550;
			}
		}
		
		function resize_whole_body(){
			if (window.innerWidth<550){
				whole_body.style.width=window.innerWidth;
				
			}
			else {
				whole_body.width=600;
				
			}
		}
		
		function clearAll() {
			//window.clearTimeout(timer);    

			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawLens();
			
			
			display_calculated_values.innerHTML = "Focal Length f = <br> Object Dist u = <br> Image Dist v = <br> Object Height h1 = <br> Image Height h2 = <br> Magnification = <br> <br>";
			application_examples.style.display="none";
			description.style.display="none";

		}
		
		function clearAllValues(){
			ip_f.value="";
			ip_u.value="";
			ip_v.value="";
			ip_h_image.value="";
			ip_h_object.value="";
		}
		
		function resetAll(){
			clearAll();
			clearAllValues();
		}
		
		
		function arrow(ctx, x1, y1, x2, y2, start, end) {
			  var rot = -Math.atan2(x1 - x2, y1 - y2);
			  ctx.beginPath();
			  ctx.moveTo(x1, y1);
			  ctx.lineTo(x2, y2);
			  ctx.stroke();
			  if (start) {
				arrowHead(ctx, x1, y1, rot);
			  }
			  if (end) {
				arrowHead(ctx, x2, y2, rot + Math.PI);
			  }
		}
		
		function arrowMiddle(ctx, x1, y1, x2, y2, start, end, reverse) {
			  var rot = -Math.atan2(x1 - x2, y1 - y2);
			  ctx.beginPath();
			  ctx.moveTo(x1, y1);
			  ctx.lineTo(x2, y2);
			  ctx.stroke();
			  if (start) {
				arrowHead(ctx, x1, y1, rot);
			  }
			  if (end) {
				arrowHead(ctx, x2, y2, rot + Math.PI);
			  }
			  if (reverse) {
				arrowHead(ctx, (x1+x2)/2, (y1+y2)/2, rot+Math.PI);
			  }
			  else {
				arrowHead(ctx, (x1+x2)/2, (y1+y2)/2, rot); 
			  }
			  
		}

		function arrowHead(ctx, x, y, rot) {
			  ctx.save();
			  ctx.translate(x, y);
			  ctx.rotate(rot);
			  ctx.beginPath();
			  ctx.moveTo(0, 0);
			  ctx.lineTo(-3, -8);
			  ctx.lineTo(3, -8);
			  ctx.closePath();
			  ctx.fill();
			  ctx.restore();
		}


		function drawLens() { // label the appropriate displacement on the animation diagram to show scale
			trailContext.font = "12px Arial";
			trailContext.textAlign="center";
			
			trailContext.lineWidth = 1;
			arrow(trailContext, 0, trailCanvas.height/2, trailCanvas.width, trailCanvas.height/2 , false, false); // draw horizontal line
			arrow(trailContext, trailCanvas.width/2, 5, trailCanvas.width/2, trailCanvas.height-5 , true, true); // draw lens
			trailContext.textAlign = "right";
            trailContext.textBaseline = "top";
			trailContext.fillText("O", trailCanvas.width/2-3, trailCanvas.height/2+3);

		}
		

		
	document.addEventListener("keydown", function (e) { // calculate when enter is pressed
		if (e.keyCode === 13) {
			calculateAll();
		}
	});
		
		
        // calculate all the u,v,a,t,s values based on 3 inputs
        function calculateAll() {
			clearAll();
            //window.clearTimeout(timer);     // first clear any motion in progress
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawLens();
			
			f = Number(ip_f.value);
			u = Number(ip_u.value);
			v = Number(ip_v.value);
			h_image = Number(ip_h_image.value);
			h_object = Number(ip_h_object.value);

			if (numberFieldsFilled() != 2) {
				alert("Please enter exactly 2 values of distances (f,u,v), you have entered " + numberFieldsFilled() + " values.");
				
			}
			if (numberFieldsFilled2() == 0) {
				alert("Both height values are left blank, a default value of 10cm is used for object height h1.");
				ip_h_object.value = 10;
				h_object = 10;
			}
			if (numberFieldsFilled2() == 2) {
				alert("Please enter only 1 value of height for either h1 or h2.");
			}
			else if (numberFieldsFilled() ==2 && numberFieldsFilled2() == 1){

				if (ip_u.value!="" && ip_v.value!=""){
					f = 1/(1/u+1/v);
				}
				if (ip_f.value!="" && ip_v.value!="" && f!=v){
					u = 1/(1/f-1/v);
				}
				if (ip_f.value!="" && ip_u.value!="" && f!=u){
					v = 1/(1/f-1/u);
				}
				if (ip_f.value!="" && ip_u.value!="" && f==u){
					v = "-infinite";
					fraction_f = 0.2;
					fraction_u = 0.2;
					fraction_v = 0;
					fraction_h_object = 0.25;
					fraction_h_image = 0;
					h_object = "NA";
					h_image = "NA";
					magnification = "NA";
				}
				else if (ip_f.value!="" && ip_v.value!="" && f==v){
					u = "infinite";
					fraction_f = 0.2;
					fraction_v = 0.2;
					fraction_u = 0;
					fraction_h_object = 0;
					fraction_h_image = 0.25;
					h_object = "NA";
					h_image = "NA";
					magnification = "NA";
				}
				else {
					
					magnification = v/u;
					
					if (ip_h_object!=""){
						h_image = magnification*h_object;
					}
					if (ip_h_image!=""){
						h_object = h_image/magnification;
					}
					
					calculateFractionalDistances();
					//alert("Magnification = "+ magnification + "v = " + v + "u = " + u + "h2 = " + h_image + "h1 = " + h_object); //debug
					//calculateFractionalDistances();
				}
				if (v*h_image<0 || f<0 || u<0 || h_object<0){
					alert("Please enter only positive values for f,u and h1 and if you enter v and h2 together, make sure both have the same sign.");
				}
				else {
					show_calculated_values();
					show_description();
					
					drawLabels();
					drawRaysImage();
				}
			}
            
        }
		
		function show_calculated_values(){
			display_calculated_values.innerHTML = "Focal Length f = " + f + "cm. <br> Object Dist u = " + u + "cm. <br> Image Dist v = " + v + "cm. <br> Object Height h1 = " + h_object + "cm. <br> Image Height h2 = " + h_image + "cm. <br> Magnification = " + magnification + " (no units)<br><br>";
		}
		
				
		function numberFieldsFilled() {
			var input_count = 0;
			if (ip_f.value!="")
			{
				input_count++;
			}
			if (ip_u.value!="")
			{
				input_count++;
			}
			if (ip_v.value!="")
			{
				input_count++;
			}
			return input_count;
		}
		
		function numberFieldsFilled2() {
			var input_count2 = 0;
			if (ip_h_object.value!="")
			{
				input_count2++;
			}
			if (ip_h_image.value!="")
			{
				input_count2++;
			}

			return input_count2;
		}

		function show_description(){
			// cases
			if (u<f){
				description.innerHTML="<u>Case 1: Object between f and lens<br><br></u>";
			}
			if (u==f){
				description.innerHTML="<u>Case 2: Object at f<br><br></u>";
			}
			if (u>f && u < 2*f){
				description.innerHTML="<u>Case 3: Object between f and 2f<br><br></u>";
			}
			if (u==2*f){
				description.innerHTML="<u>Case 4: Object at 2f<br><br></u>";
			}
			if (u>2*f){
				description.innerHTML="<u>Case 5: Object beyond 2f<br><br></u>";
			}
			if (u=="infinite"){
				description.innerHTML="<u>Case 6: Distant object at infinity<br><br></u>";
			}
			
			// image is:
			description.innerHTML+="Image is:<br>";
			
			// virtual or real
			if (v<0 || f==u){
				description.innerHTML+="1. virtual.<br>";
			}
			else{
				description.innerHTML+="1. real.<br>";
			}
			
			// same side or opposite side
			if (v<0 || f==u){
				description.innerHTML+="2. at same side of lens as object.<br>";
			}
			else{
				description.innerHTML+="2. at opposite side of lens compared to object.<br>";
			}
			
			// upright or inverted
			if (h_image<0 || f==u){
				description.innerHTML+="3. upright.<br>";
			}
			else{
				description.innerHTML+="3. inverted.<br>";
			}
			
			// magnified, diminished or same size
			if (f==u){
				description.innerHTML+="4. magnified. <br> (In this special case image is distant/at infinity (at a very far distance away as shown by parallel rays which extend all the way out to the image).";
			}
			if (f==v){
				description.innerHTML+="4.diminished. <br> (In this special case object is distant/at infinity (at a very far distance away as shown by parallel rays which extend all the way from the object to form an image at f).";
			}
			if (Math.abs(magnification)<1){
				description.innerHTML+="4. diminished.";
			}
			if (Math.abs(magnification)>1){
				description.innerHTML+="4. magnified.";
			}
			if (Math.abs(magnification)==1){
				description.innerHTML+="4. same size as object.";
			}
			
			description.style.display = "inline";
			
			//application examples
			if (f==v){
				application_examples.innerHTML="Objective lens of telescope.<br><br>";
			}
			if (u<f){
				application_examples.innerHTML="Magnifying glass.<br><br>";
			}
			if (u==f){
				application_examples.innerHTML="Produce parallel beam of light for example in spotlight.<br><br>";
			}
			if (u>f && u < 2*f){
				application_examples.innerHTML="Projector.<br>Photograph enlarger.";
			}
			if (u==2*f){
				application_examples.innerHTML="Lens in photocopier (to make equal size copy).<br><br>";
			}
			if (u>2*f){
				application_examples.innerHTML="Camera.<br>Eye.";
			}
			
			
			
			application_examples.style.display = "inline";
		}
		
		function calculateFractionalDistances(){
			fraction_f = (f / Math.max(Math.max(Math.abs(u), Math.abs(v)), Math.abs(f))) / 2 * width_scale_factor;
			fraction_u = (u / Math.max(Math.max(Math.abs(u), Math.abs(v)), Math.abs(f))) / 2 * width_scale_factor;
			fraction_v = (v / Math.max(Math.max(Math.abs(u), Math.abs(v)), Math.abs(f))) / 2 * width_scale_factor;
			
			fraction_h_object = (h_object / Math.max(Math.abs(h_object), Math.abs(h_image))) / 2 * height_scale_factor;
			fraction_h_image = (h_image / Math.max(Math.abs(h_object), Math.abs(h_image))) / 2 * height_scale_factor;
		}
		
		// label positions of F and 2F on the graph
		// f is focal length, F is position of focal point
		// O is optical centre labelled in drawLens() function
		function drawLabels(){
			// alert("fraction f=" + fraction_f); //debug
			arrow(trailContext, theCanvas.width*(0.5-fraction_f), theCanvas.height*0.5-5, theCanvas.width*(0.5-fraction_f), theCanvas.height*0.5+5, false, false);
			arrow(trailContext, theCanvas.width*(0.5-2*fraction_f), theCanvas.height*0.5-5,theCanvas.width*(0.5-2*fraction_f), theCanvas.height*0.5+5, false, false);
			arrow(trailContext, theCanvas.width*(0.5+fraction_f), theCanvas.height*0.5-5, theCanvas.width*(0.5+fraction_f), theCanvas.height*0.5+5, false, false);
			arrow(trailContext, theCanvas.width*(0.5+2*fraction_f), theCanvas.height*0.5-5, theCanvas.width*(0.5+2*fraction_f), theCanvas.height*0.5+5, false, false);
			trailContext.font = "12px Arial";
			trailContext.textAlign="center";
			trailContext.fillText("F",theCanvas.width*(0.5-fraction_f), theCanvas.height*0.5+20);
			trailContext.fillText("2F",theCanvas.width*(0.5-2*fraction_f), theCanvas.height*0.5+20);
			trailContext.fillText("F",theCanvas.width*(0.5+fraction_f), theCanvas.height*0.5+20);
			trailContext.fillText("2F",theCanvas.width*(0.5+2*fraction_f), theCanvas.height*0.5+20);
		}
		
		
		function drawRaysImage(){
			theContext.font = "10px Arial";
			theContext.textAlign="center";
			//theContext.textBaseline="top";
			
			if (f!=v){
				//object
				theContext.lineWidth = 2;
				theContext.strokeStyle = 'black';
				theContext.setLineDash([2, 0]); // make solid
				theContext.fillStyle = text_colour;
				arrow(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5), true, false);
				theContext.textBaseline="top";
				theContext.fillText("obj",theCanvas.width*(0.5-fraction_u), theCanvas.height*0.5+10);
			}
			
			if (f!=u){
				//image
				theContext.lineWidth = 2;
				theContext.strokeStyle = 'black';
				theContext.setLineDash([2, 2]); // make dotted
				arrow(theContext, theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5), theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5+fraction_h_image), false, true);
				if (h_image>0 || f==v){
					theContext.textBaseline="bottom";
					theContext.fillStyle = text_colour;
					theContext.fillText("img",theCanvas.width*(0.5+fraction_v), theCanvas.height*0.5-10);
				}
				else if (h_image<0){
					theContext.textBaseline="top";
					theContext.fillStyle = text_colour;
					theContext.fillText("img",theCanvas.width*(0.5+fraction_v), theCanvas.height*0.5+10);
				}
			}
			
			//horizontal light from object to lens
			theContext.lineWidth = 1;
			theContext.strokeStyle = ray_colour;
			theContext.fillStyle = ray_colour;
			theContext.setLineDash([2, 0]); // make solid
			arrowMiddle(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), false, false, true);
			
			
			if (f==u){
				//2 virtual rays from infinity to object and lens
				theContext.lineWidth = 1;
				theContext.strokeStyle = ray_colour;
				theContext.fillStyle = ray_colour;
				theContext.setLineDash([2, 2]); // make dotted
				arrow(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5-fraction_u), 0, false, false);
				arrow(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5-2*fraction_f), 0, false, false);
				
				// 2 rays after lens extending out
				theContext.setLineDash([2, 0]); // make solid
				arrowMiddle(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+2*fraction_f), theCanvas.height*0.75, false, false, true);
				arrowMiddle(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+fraction_f), theCanvas.height*0.75, false, false, true);
				
			}
			
			// 2 real rays from infinity to form image at F
			if (f==v){
				theContext.lineWidth = 1;
				theContext.strokeStyle = ray_colour;
				theContext.fillStyle = ray_colour;
				theContext.setLineDash([2, 0]); // make solid
				arrowMiddle(theContext, theCanvas.width*(0.5-2*fraction_f), theCanvas.height*(0.5-2*fraction_h_image), theCanvas.width*(0.5+fraction_f), theCanvas.height*(0.5+fraction_h_image), false, false, true);
				arrowMiddle(theContext, theCanvas.width*(0.5-2*fraction_f), theCanvas.height*(0.5-fraction_h_image), theCanvas.width*(0.5), theCanvas.height*(0.5+fraction_h_image), false, false, true);
				arrowMiddle(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5+fraction_h_image), theCanvas.width*(0.5+fraction_f), theCanvas.height*(0.5+fraction_h_image), false, false, true);
			}
			
			// 2 real rays after lens to image			
			if (f!=u && f!=v){
				theContext.lineWidth = 1;
				theContext.strokeStyle = ray_colour;
				theContext.fillStyle = ray_colour;
				if (v>0){
					theContext.fillStyle = ray_colour;
					theContext.setLineDash([2, 0]); // make solid
					arrowMiddle(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5+fraction_h_image), false, false, true);
					arrowMiddle(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5+fraction_h_image), false, false, true);
				}
				else if (v<0){
					theContext.fillStyle = ray_colour;
					theContext.setLineDash([2, 2]); // make dotted as it would be virtual ray joining image to object
					arrow(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5+fraction_h_image), false, false);
					arrow(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+fraction_v), theCanvas.height*(0.5+fraction_h_image), false, false);
				}
				
			}
			
			// if image at same side of lens
			if (v<0){
				var y2;
				theContext.lineWidth = 1;
				theContext.strokeStyle = ray_colour;
				theContext.fillStyle = ray_colour;
				theContext.setLineDash([2, 0]); // make solid
				
				// real ray from image to f at other side of lens
				if (f > Math.abs(v)){
					y2 = theCanvas.height*0.5;
				}
				else {
					y2 = theCanvas.height*(0.5-fraction_h_object+Math.abs(fraction_h_image)-fraction_h_object);
				}
				arrowMiddle(theContext, theCanvas.width*(0.5), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5+Math.max(Math.abs(fraction_v),fraction_f)), y2, false, false, true);
				
				// real ray from image through O and other side of lens
				arrowMiddle(theContext, theCanvas.width*(0.5-fraction_u), theCanvas.height*(0.5-fraction_h_object), theCanvas.width*(0.5-fraction_v), theCanvas.height*(0.5-fraction_h_image), false, false, true);
			}
			
			
			
			
		}
		
		var mouseDown = 0;
			document.onmousedown = function() { 
					mouseDown = 1;
			}
			document.onmouseup = function() {
					mouseDown = 0;
			}
			
			function touchMoveInCanvas() {
				
				if (checkbox1.checked==true){
				var rect = theCanvas.getBoundingClientRect();
				x_pos = event.touches[0].pageX - rect.left;
				
				//y_pos = event.touches[0].pageY - rect.top;
				if (x_pos < theCanvas.width/2){
					f = 10;
					fraction_f = horizontal_zoom.value;
					fraction_u = 0.5 - x_pos/theCanvas.width;
					h_object = 10;
					fraction_h_object = vertical_zoom.value;
					
					drawFreeAndEasy();
					show_calculated_values();
					show_description();
				}
				}
				
			}	
			
			function mouseMoveInCanvas(evt) {
				if (mouseDown==true){
				if (checkbox1.checked==true){
				var rect = theCanvas.getBoundingClientRect();     
				x_pos = evt.clientX - rect.left;
				
				//y_pos = evt.clientY - rect.top;
				if (x_pos < theCanvas.width/2){
					f = 10;
					fraction_f = horizontal_zoom.value;
					fraction_u = 0.5 - x_pos/theCanvas.width;
					h_object = 10;
					fraction_h_object = vertical_zoom.value;
					
					drawFreeAndEasy();
					show_calculated_values();
					show_description();
				}
				}
				}
			}		
			
			function drawFreeAndEasy(){
				u = fraction_u * f/fraction_f;
				v = 1/(1/f-1/u);
				fraction_v = v/(f/fraction_f);
				magnification = v/u;
				h_image = magnification * h_object;
				fraction_h_image = magnification * fraction_h_object;
					
					clearAll();
					drawLabels();
					drawRaysImage();
			}
			
			function switchMode() {
				if (checkbox1.checked==true){
					clearAll();
					form_table.style.display ="none";
					initial_instructions.style.display ="none";
					zoom_scaling.style.display ="inline";
					theContext.textAlign="left";
					theContext.textBaseline="top";
					theContext.fillStyle = text_colour;
					theContext.font = "12px Arial";
					theContext.fillText("Start dragging here.",10,10, theCanvas.width/2);
					theContext.fillText("Drag, not just click or touch.",10,30, theCanvas.width/2);
				}
				else if (checkbox1.checked==false){
					clearAll();
					form_table.style.display ="inline";
					initial_instructions.style.display ="inline";
					zoom_scaling.style.display ="none";
				}
			}
			
			function zoom_h(){
				fraction_u = fraction_u*horizontal_zoom.value/fraction_f;
				fraction_f = horizontal_zoom.value;
				drawFreeAndEasy();
			}
			
			function zoom_v(){
				fraction_h_object = vertical_zoom.value;
				drawFreeAndEasy();
			}
			
			function zoom_both(){
				horizontal_zoom.value = both_zoom.value;
				vertical_zoom.value = both_zoom.value;
				fraction_u = fraction_u*horizontal_zoom.value/fraction_f;
				fraction_f = horizontal_zoom.value;
				fraction_h_object = vertical_zoom.value;
				drawFreeAndEasy();
			}
			
			theCanvas.addEventListener('mousemove', mouseMoveInCanvas, false);
			theCanvas.addEventListener("touchmove", touchMoveInCanvas, false);
			theCanvas.addEventListener("touchstart", touchMoveInCanvas, false);



  
