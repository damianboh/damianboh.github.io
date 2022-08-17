/********
    Copyright 2017, Simulations and Website Template by Damian Boh
    This work by Damian Boh is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
	Please visit http://creativecommons.org/licenses/by-nc-sa/4.0/ for more information.
********/
    
		var theCanvas = document.getElementById("theCanvas");   
        var theContext = theCanvas.getContext("2d");
        var trailCanvas = document.getElementById("trailCanvas");  
        var trailContext = trailCanvas.getContext("2d");
		var ip_initial_u = document.getElementById("ip_initial_u");
		var ip_final_v = document.getElementById("ip_final_v");
		var ip_acceleration_a = document.getElementById("ip_acceleration_a");
		var ip_time_t = document.getElementById("ip_time_t");
		var ip_displacement_s = document.getElementById("ip_displacement_s");
        var animation_speed = document.getElementById("animation_speed");
        var u, v, a, t, s;                          // kinematic variables
		var u_pos, u_neg, v_pos, v_neg, t1, t2;     // to account for 2 solutions when solving sqrt of u^2 and v^2
		var number_filled;							// number of fields with values entered
		var t_current = 0;							// current time of object motion when animation is playing
		var s_current;
		var v_current;
        var timer;                                  // for animation timing
		var abs_max_displacement;
		var max_displacement;						
		var max_time;
		var max_velocity;
		var min_velocity;
		var min_displacement;
		var min_time;
		
		var animation_current_status = document.getElementById("animation_current_status");
		var solution_header = document.getElementById("solution_header");
		var display_calculated_values = document.getElementById("display_calculated_values");
		var display_explanation_header = document.getElementById("display_explanation_header");
		var display_explanation_1 = document.getElementById("display_explanation_1");
		var display_explanation_middle = document.getElementById("display_explanation_middle");
		var display_explanation_2 = document.getElementById("display_explanation_2");
		var display_solution_not_valid = document.getElementById("display_solution_not_valid");
		var solution_checkboxes = document.getElementById("solution_checkboxes");
		var display_2_solutions_u_notice = document.getElementById("display_2_solutions_u_notice");
		var display_2_solutions_v_notice = document.getElementById("display_2_solutions_v_notice");
		var display_2_u_t_interpretation = document.getElementById("display_2_u_t_interpretation");
		var display_2_v_t_interpretation = document.getElementById("display_2_v_t_interpretation");
		var checkbox1 = document.getElementById("checkbox1");
		var checkbox2 = document.getElementById("checkbox2");
		var pause_resume_button = document.getElementById("pause_resume_button");
		var checkbox_right = document.getElementById("checkbox_right");
		var checkbox_upwards = document.getElementById("checkbox_upwards");
		
		// used for description of motion in words
		var initial_velocity_direction;
		var initial_velocity_sign;
		var final_velocity_direction;
		var final_velocity_sign;
		var decelerate_accelerate;
		var acceleration_u_opp_same_sign;
		var v_u_opp_same_sign;
		var description_of_motion = document.getElementById("description_of_motion");
		var motion_description1 = document.getElementById("motion_description1");
		var motion_description2 = document.getElementById("motion_description2");
		var motion_description3 = document.getElementById("motion_description3");
		var motion_inference1 = document.getElementById("motion_inference1");
		var motion_inference2 = document.getElementById("motion_inference2");
		var motion_inference3 = document.getElementById("motion_inference3");
		
		var device_size = document.getElementById("device_size");
		
		// for drawing graphs
		var xPadding = 60; // space for axis and labels
        var yPadding = 30;
		var x_offset = 20;
		var y_offset = 20;
		var t_previous;
		var s_previous;
		var v_previous;
		var displacement_graph = document.getElementById("displacement_graph");
		var displacementContext = displacement_graph.getContext('2d');  
		var velocity_graph = document.getElementById("velocity_graph");
		var velocityContext = velocity_graph.getContext('2d');  
		
		checkbox1.checked = true;
		checkbox_right.checked = true;
		resizeCanvas();
		//resize_whole_body();
		resetAll();
		display_calculated_values.style.display="none";
		
		device_size.innerHTML="Device width: " + window.innerWidth + ", height: " + window.innerHeight;
		
		function toggleRight(){
			if (checkbox_right.checked==true){
				checkbox_upwards.checked=false;
				
				theCanvas.height=120;
				trailCanvas.height=120;
				if (window.innerWidth<550){
					theCanvas.width=0.98*window.innerWidth;
					trailCanvas.width=0.98*window.innerWidth;
				}
				else {
					theCanvas.width=550;
					trailCanvas.width=550;
				}
				drawObjectCenter();
			}
			
			if (checkbox_right.checked==false){
				checkbox_upwards.checked=true;
				theCanvas.width=250;
				trailCanvas.width=250;
				theCanvas.height=300;
				trailCanvas.height=300;
				
				drawObjectCenter();
			}

		}
		
		function toggleUpwards(){
			if (checkbox_upwards.checked==true){
				checkbox_right.checked=false;
				theCanvas.width=250;
				trailCanvas.width=250;
				theCanvas.height=300;
				trailCanvas.height=300;
				
				drawObjectCenter();
			}
			if (checkbox_upwards.checked==false){
				checkbox_right.checked=true;
				theCanvas.height=120;
				trailCanvas.height=120;
				if (window.innerWidth<550){
					theCanvas.width=0.98*window.innerWidth;
					trailCanvas.width=0.98*window.innerWidth;
				}
				else {
					theCanvas.width=550;
					trailCanvas.width=550;
				}
				
				drawObjectCenter();
			}
			
		}
		
		
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
			window.clearTimeout(timer);     // first clear any motion in progress
			document.getElementById("pause_resume_button").value="Pause"; // turn button into pause
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawObjectCenter();
			solution_header.style.display="none";
			display_calculated_values.style.display="none";
			display_explanation_header.style.display="none";
			display_explanation_1.style.display="none";
			display_explanation_middle.style.display="none";
			display_explanation_2.style.display="none";
			display_solution_not_valid.style.display="none";
			display_2_solutions_u_notice.style.display="none";
			display_2_solutions_v_notice.style.display="none";
			display_2_u_t_interpretation.style.display="none";
			display_2_v_t_interpretation.style.display="none";
			description_of_motion.style.display="none";
			inference_of_motion.style.display="none";
			
			solution_checkboxes.style.display="none";
			
			animation_current_status.innerHTML="Current Displacement s: 0m<br/>Current Time t: 0s";
			initializeDisplacementGraph();
			initializeVelocityGraph();
		

		}
		
		function clearAllValues(){
			ip_initial_u.value="";
			ip_final_v.value="";
			ip_acceleration_a.value="";
			ip_time_t.value="";
			ip_displacement_s.value="";
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
		
		
		
////////////////////// start of functions for drawing graphs /////////////////////////
	
	//###############DISPLACEMENT GRAPH
	
		// Return the x pixel for a graph point for displacement
        function getXPixel(val) {
            // uses the getMaxX() function
            return (val/t *(displacement_graph.width - xPadding - x_offset) + xPadding); 
			// current time over total time * total height of line graph
			// xPadding needed to make space for labelling of y-axis
			// x_offset needed so graph will not go out of canvas
        }
            
        // Return the y pixel for a graph point for displacement
        function getYPixel_displacement(val) {
            return (displacement_graph.height - yPadding - (((val-min_displacement)/(max_displacement-min_displacement))*(displacement_graph.height - yPadding - y_offset)));
        }
		
        
		function drawAxisDisplacement() {        
			displacementContext.lineWidth = 2;
			displacementContext.strokeStyle = '#333';
			displacementContext.font = 'bold 10pt sans-serif';
			displacementContext.textAlign = "center";
			displacementContext.textBaseline = "top";
			
			// title of graph // label above center of y-axis, not center of whole canvas
			displacementContext.fillText("Displacement-Time Graph", (displacement_graph.width-xPadding)/2+xPadding, 0);
			
			displacementContext.textAlign = "left";
					
			// draw the axes
			arrow(displacementContext, xPadding, displacement_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			displacementContext.fillText("s", xPadding+6, 0);
			
			displacementContext.textAlign = "right";
			displacementContext.textBaseline = "bottom";
			
			// x axis (shifts according to where is y = 0)
			if (max_displacement==undefined){
				arrow(displacementContext, xPadding-5, displacement_graph.height - yPadding, displacement_graph.width, displacement_graph.height - yPadding, false, true );
				//displacementContext.lineTo(displacement_graph.width, displacement_graph.height - yPadding); //x-axis
				displacementContext.fillText("t", displacement_graph.width, displacement_graph.height - yPadding - 5);
			}
	
			else if (max_displacement!=undefined){
				arrow(displacementContext, xPadding-5, getYPixel_displacement(0), displacement_graph.width, getYPixel_displacement(0), false, true);
				displacementContext.fillText("t", displacement_graph.width, getYPixel_displacement(0) - 5);
			}
			displacementContext.stroke();
		}
		
		function labelAxisDisplacement() {
				displacementContext.font = 'italic 8pt sans-serif';
				displacementContext.textAlign = "right";
                displacementContext.textBaseline = "top";
				
                //label origin
				displacementContext.fillText(0, xPadding-5, getYPixel_displacement(0));
				
				displacementContext.font = 'italic 8pt sans-serif';
				displacementContext.textAlign = "center";
                displacementContext.textBaseline = "alphabetic";
				
                // label x axis values
                for(var i = 1; i < 4; i ++) {
                   
                    displacementContext.fillText((t/3*i).toPrecision(3), getXPixel(t/3*i), getYPixel_displacement(0) + 20);
					// mark out the axis
					displacementContext.strokeStyle = '#000';
					displacementContext.beginPath();
					displacementContext.moveTo(getXPixel(t/3*i), getYPixel_displacement(0) - 5 );
					displacementContext.lineTo(getXPixel(t/3*i), getYPixel_displacement(0) + 5);
				   	displacementContext.stroke();
                }
                
                // label y axis values
				displacementContext.textAlign = "right";
                displacementContext.textBaseline = "middle";
                
                for(var i = 0; i < 4; i ++) {
                    displacementContext.fillText(((max_displacement-min_displacement)/3*i+min_displacement).toPrecision(3), xPadding - 10, getYPixel_displacement(((max_displacement-min_displacement)/3*i+min_displacement)));
					// mark out the axis
					displacementContext.strokeStyle = '#000';
					displacementContext.beginPath();
					displacementContext.moveTo(xPadding - 5, getYPixel_displacement(((max_displacement-min_displacement)/3*i+min_displacement)));
					displacementContext.lineTo(xPadding + 5, getYPixel_displacement(((max_displacement-min_displacement)/3*i+min_displacement)));
				   	displacementContext.stroke();
                }
		}
		
				
		function initializeDisplacementGraph() {
			displacementContext.clearRect(0, 0, displacement_graph.width, displacement_graph.height);
			drawAxisDisplacement();
			labelAxisDisplacement();
			t_previous = 0;
			s_previous = 0;
		}
		
		function drawDisplacementGraph() {
				
				
                
                displacementContext.strokeStyle = '#f00';
                
                // Draw the line graph point by point
                displacementContext.beginPath();
                displacementContext.moveTo(getXPixel(t_previous), getYPixel_displacement(s_previous));
              
                displacementContext.lineTo(getXPixel(t_current), getYPixel_displacement(s_current));
               
                displacementContext.stroke();
				
				//t_previous = t_current; 
				//don't put t_previous = t_current first as drawVelocityGraph() still needs this previous value
				s_previous = s_current;
                

        }
		
		
	//###############VELOCITY GRAPH
		
		
            
        // Return the y pixel for a graph point for velocity
        function getYPixel_velocity(val) {
            return (velocity_graph.height - yPadding - (((val-min_velocity)/(max_velocity-min_velocity))*(velocity_graph.height - yPadding - y_offset)));
        }
		
        
		function drawAxisVelocity() {        
			velocityContext.lineWidth = 2;
			velocityContext.strokeStyle = '#333';
			velocityContext.font = 'bold 10pt sans-serif';
			velocityContext.textAlign = "center";
			velocityContext.textBaseline = "top";
			
			// title of graph // label above center of y-axis, not center of whole canvas
			velocityContext.fillText("Velocity-Time Graph", (velocity_graph.width-xPadding)/2+xPadding, 0);
			
			velocityContext.textAlign = "left";
					
			// draw the axes
			arrow(velocityContext, xPadding, velocity_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			velocityContext.fillText("v", xPadding+6, 0);
			
			velocityContext.textAlign = "right";
			velocityContext.textBaseline = "bottom";
			
			// x axis (shifts according to where is y = 0)
			if (max_velocity==undefined){
				arrow(velocityContext, xPadding-5, velocity_graph.height - yPadding, velocity_graph.width, velocity_graph.height - yPadding, false, true );
				//velocityContext.lineTo(velocity_graph.width, velocity_graph.height - yPadding); //x-axis
				velocityContext.fillText("t", velocity_graph.width, velocity_graph.height - yPadding - 5);
			}
	
			else if (max_velocity!=undefined){
				arrow(velocityContext, xPadding-5, getYPixel_velocity(0), velocity_graph.width, getYPixel_velocity(0), false, true);
				velocityContext.fillText("t", velocity_graph.width, getYPixel_velocity(0) - 5);
			}
			velocityContext.stroke();
		}
		
		function labelAxisVelocity() {
				velocityContext.font = 'italic 8pt sans-serif';
				velocityContext.textAlign = "right";
                velocityContext.textBaseline = "top";
				
                //label origin
				velocityContext.fillText(0, xPadding-5, getYPixel_velocity(0));
				
				velocityContext.font = 'italic 8pt sans-serif';
				velocityContext.textAlign = "center";
                velocityContext.textBaseline = "alphabetic";
				
                // label x axis values
                for(var i = 1; i < 4; i ++) {
                   
                    velocityContext.fillText((t/3*i).toPrecision(3), getXPixel(t/3*i), getYPixel_velocity(0) + 20);
					// mark out the axis
					velocityContext.strokeStyle = '#000';
					velocityContext.beginPath();
					velocityContext.moveTo(getXPixel(t/3*i), getYPixel_velocity(0) - 5 );
					velocityContext.lineTo(getXPixel(t/3*i), getYPixel_velocity(0) + 5);
				   	velocityContext.stroke();
                }
                
                // label y axis values
				velocityContext.textAlign = "right";
                velocityContext.textBaseline = "middle";
                
                for(var i = 0; i < 4; i ++) {
                    velocityContext.fillText(((max_velocity-min_velocity)/3*i+min_velocity).toPrecision(3), xPadding - 10, getYPixel_velocity(((max_velocity-min_velocity)/3*i+min_velocity)));
					// mark out the axis
					velocityContext.strokeStyle = '#000';
					velocityContext.beginPath();
					velocityContext.moveTo(xPadding - 5, getYPixel_velocity(((max_velocity-min_velocity)/3*i+min_velocity)));
					velocityContext.lineTo(xPadding + 5, getYPixel_velocity(((max_velocity-min_velocity)/3*i+min_velocity)));
				   	velocityContext.stroke();
                }
		}
		
				
		function initializeVelocityGraph() {
		
			velocityContext.clearRect(0, 0, velocity_graph.width, velocity_graph.height);
			drawAxisVelocity();
			labelAxisVelocity();
			t_previous = 0;
			v_previous = u;
		}
		
		function drawVelocityGraph() {
				
				
                
                velocityContext.strokeStyle = '#f00';
                
                // Draw the line graph point by point
                velocityContext.beginPath();
                velocityContext.moveTo(getXPixel(t_previous), getYPixel_velocity(v_previous));
              
                velocityContext.lineTo(getXPixel(t_current), getYPixel_velocity(v_current));
               
                velocityContext.stroke();
				
				t_previous = t_current;
				v_previous = v_current;
                

        }
		
////////////////////// end of functions for drawing graphs /////////////////////////
		
	document.addEventListener("keydown", function (e) { // calculate when enter is pressed
		if (e.keyCode === 13) {
			calculateAll();
		}
	});
		
		
        // calculate all the u,v,a,t,s values based on 3 inputs
        function calculateAll() {
			clearAll();
            window.clearTimeout(timer);     // first clear any motion in progress
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawObjectCenter(); // make sure object is still there since we are not drawing it in animation
			
			u = Number(ip_initial_u.value);
			v = Number(ip_final_v.value);
			a = Number(ip_acceleration_a.value);
			t = Number(ip_time_t.value);
			s = Number(ip_displacement_s.value);
			getNumberFieldsFilled();
			if (number_filled != 3) {
				alert("Please enter exactly 3 values, you have entered " + number_filled + " values.");
			}
			else {

				
				if (ip_initial_u.value!="" && ip_final_v.value!="" && ip_acceleration_a.value!=""){
					t = (v-u)/a;
					s = 0.5*(u+v)*t;
					display_calculated_values.innerHTML="Time t = " + t + "s" +"<br/>"+ "Displacement s = " + s + "m";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known u, v and a values into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get time t = " + t + "s.<br/><br/>Now you know u, v, a and t.";
					display_explanation_2.innerHTML="In this case, the simplest way to get s (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get displacement s = " + s + "m.";
				}
				if (ip_initial_u.value!="" && ip_final_v.value!="" && ip_time_t.value!=""){
					a = (v-u)/t;
					s = 0.5*(u+v)*t;
					display_calculated_values.innerHTML="Acceleration a = " + a + "ms<sup>-2</sup>" +"<br/>"+ "Displacement s = " + s + "m";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known u, v and t values into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get acceleration a = " + a + "ms<sup>-2</sup>.<br/><br/>Now you know u, v, a and t.";
					display_explanation_2.innerHTML="In this case, the simplest way to get s (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get displacement s = " + s + "m.";
				}
				if (ip_initial_u.value!="" && ip_final_v.value!="" && ip_displacement_s.value!=""){
					t = 2*s/(u+v);
					a = (v-u)/t;
					display_calculated_values.innerHTML="Time t = " + t + "s" +"<br/>"+ "Acceleration a = " + a + "ms<sup>-2</sup>";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known u, v and s values into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get acceleration t = " + t + "s.<br/><br/>Now you know u, v, s and t.";
					display_explanation_2.innerHTML="In this case, the simplest way to get a (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get acceleration a = " + a + "ms<sup>-2</sup>.";
				}
				if (ip_initial_u.value!="" && ip_acceleration_a.value!="" && ip_time_t.value!=""){
					v = u + a*t;
					s = 0.5*(u+v)*t;
					display_calculated_values.innerHTML="Final velocity v = " + v + "ms<sup>-1</sup>" +"<br/>"+ "Displacement s = " + s + "m";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known u, a and t values into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get final velocity v = " + v + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, a and t.";
					display_explanation_2.innerHTML="In this case, the simplest way to get s (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get displacement s = " + s + "m.";
				}
				if (ip_initial_u.value!="" && ip_time_t.value!="" && ip_displacement_s.value!=""){
					v = 2*s/t - u;
					a = (v-u)/t;
					display_calculated_values.innerHTML="Final velocity v = " + v + "ms<sup>-1</sup>" +"<br/>"+ "Acceleration a = " + a + "ms<sup>-2</sup>";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known u, t and s values into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get final velocity v = " + v + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, t and s.";
					display_explanation_2.innerHTML="In this case, the simplest way to get a (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get acceleration a = " + a + "ms<sup>-2</sup>.";
				}
				if (ip_final_v.value!="" && ip_acceleration_a.value!="" && ip_time_t.value!=""){
					u = v - a*t;
					s = 0.5*(u+v)*t;
					display_calculated_values.innerHTML="Initial velocity u = " + u + "ms<sup>-1</sup>" +"<br/>"+ "Displacement s = " + s + "m";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known v, a and t values into the equation <br/> <br/> <b>v = u +at</b> <br/> <br/> to get initial velocity u = " + u + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, a and t.";
					display_explanation_2.innerHTML="In this case, the simplest way to get s (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get displacement s = " + s + "m.";
				}
				if (ip_final_v.value!="" && ip_time_t.value!="" && ip_displacement_s.value!=""){
					u = 2*s/t - v;
					a = (v-u)/t;
					display_calculated_values.innerHTML="Initial velocity u = " + u + "ms<sup>-1</sup>" +"<br/>"+ "Acceleration a = " + a + "ms<sup>-2</sup>";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known v, t and s values into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t</b> <br/> <br/> to get initial velocity u = " + u + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, t and s.";
					display_explanation_2.innerHTML="In this case, the simplest way to get a (final unknown variable) is to substitute u, v and t into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get acceleration a = " + a + "ms<sup>-2</sup>.";
				}
				if (ip_acceleration_a.value!="" && ip_time_t.value!="" && ip_displacement_s.value!=""){
					u = (s - 0.5*a*t*t)/t;
					v = u + a*t;
					display_calculated_values.innerHTML="Initial velocity u = " + u + "ms<sup>-1</sup>" +"<br/>"+ "Final velocity v = " + v + "ms<sup>-1</sup>";
					display_calculated_values.style.display="inline";
					display_explanation_1.innerHTML="In this case, substitute your known a, t and s values into the equation <br/> <br/> <b>s = ut + <sup>1</sup>/<sub>2</sub> at<sup>2</sup></b> <br/> <br/> to get initial velocity u = " + u + "ms<sup>-1</sup>.<br/><br/>Now you know u, a, t and s.";
					display_explanation_2.innerHTML="In this case, the simplest way to get v (final unknown variable) is to substitute u, a and t into the equation <br/> <br/> <b>v = u + at</b> <br/> <br/> to get final velocity v = " + v + "ms<sup>-1</sup>.";
				}
				if (ip_initial_u.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!=""){
					if ((u*u + 2*a*s) < 0){
						errorEvent();
					}
					else {
						v_pos = Math.abs(Math.sqrt(u*u + 2*a*s));
						v_neg = -v_pos;
						t1 = 2*s/(u+v_pos);
						t2 = 2*s/(u+v_neg);
						solution_checkboxes.style.display="inline";
						show_uas_vas_solution();
					}
					
				}
				if (ip_final_v.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!=""){
					if ((v*v - 2*a*s) < 0){
						errorEvent();
					}
					else {
						u_pos = Math.abs(Math.sqrt(v*v - 2*a*s));
						u_neg = -u_pos;
						t1 = 2*s/(u_pos+v);
						t2 = 2*s/(u_neg+v);
						solution_checkboxes.style.display="inline";
						show_uas_vas_solution();
					}
					
				}
				
				
				
				if (!(ip_initial_u.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!="") && !(ip_final_v.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!="")){
					solution_header.style.display="inline";
					display_explanation_header.style.display="inline";
					display_explanation_middle.style.display="inline";
					display_explanation_1.style.display="inline";
					display_explanation_2.style.display="inline";
					start_animation_and_draw_graph();
					
				}
			}
            

        }
		
		function start_animation_and_draw_graph(){
			t_current = 0;
					// find max and min values to scale animation and graph 
					
					if (u*v<0){
						abs_max_displacement = Math.max(Math.abs(s),Math.abs(u*u/(2*a)));
						max_displacement = Math.max(s,-(u*u/(2*a)));
						min_displacement = Math.min(s,-(u*u/(2*a)));
						
						if (s>0 && -(u*u/(2*a))>0)
						{
							min_displacement = 0;
						}
						if (s<0 && -(u*u/(2*a))<0)
						{
							max_displacement = 0;
						}
					}
					else {
						abs_max_displacement = Math.abs(s);
						if (s<0){
							max_displacement = 0;
							min_displacement = s;
						}
						else if (s>0){
							max_displacement = s;
							min_displacement = 0;					
						}
						
						else if (s>0){
							max_displacement = 0;
							min_displacement = 0;					
						}
					}
					max_velocity = Math.max(u,v);
					min_velocity = Math.min(u,v);
				    if (u>0 && v>0)
						{
							min_velocity = 0;
					}
					if (u<0 && v<0)
						{
							max_velocity = 0;
					}
					if (t<0) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("SOLUTION NOT VALID AS TIME t < 0. Steps for calculating this are still shown for reference but remember this is not a valid solution so please check your entered values again.");
					}
					else if (isNaN(t)) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("No valid solution found. Please check values and enter again.");
						resetAll();
					}
					else if (isNaN(v)) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("No valid solution found. Please check values and enter again.");
						resetAll();
					}
					else if (isNaN(u)) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("No valid solution found. Please check values and enter again.");
						resetAll();
					}
					else if (isNaN(a)) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("No valid solution found. Please check values and enter again.");
						resetAll();
					}
					else if (isNaN(s)) {
						display_solution_not_valid.style.display="inline";
						animation_current_status.innerHTML="Invalid solution. No animation.";
						alert("No valid solution found. Please check values and enter again.");
						resetAll();
					}
					else{
						// solution_header.innerHTML = max_displacement + "," + min_displacement; // remove after debugging
						labelDisplacement();
						initializeDisplacementGraph();
						initializeVelocityGraph();
						moveObject();
						generate_description();
						
					}
		}
		
		function labelDisplacement() { // label the appropriate displacement on the animation diagram to show scale
			trailContext.font = "12px Arial";
			
			
			
			
			if (checkbox_right.checked==true){
				trailContext.textAlign="center";
				trailContext.textBaseline="top";
				trailContext.fillText("s=" + abs_max_displacement.toPrecision(3) + "m",trailCanvas.width/2+trailCanvas.width/2*0.8,trailCanvas.height*0.9);
				trailContext.fillText("s=-" + abs_max_displacement.toPrecision(3) + "m",trailCanvas.width/2-trailCanvas.width/2*0.8,trailCanvas.height*0.9);
				trailContext.fillText("3 s.f.",trailCanvas.width/2+trailCanvas.width/2*0.8,trailCanvas.height*0.9+12);
				trailContext.fillText("3 s.f.",trailCanvas.width/2-trailCanvas.width/2*0.8,trailCanvas.height*0.9+12);
				
				trailContext.setLineDash([2, 2]);
				trailContext.beginPath();
				trailContext.moveTo(trailCanvas.width/2+trailCanvas.width/2*0.8,trailCanvas.height*0.2);
				trailContext.lineTo(trailCanvas.width/2+trailCanvas.width/2*0.8,trailCanvas.height*0.8);
				trailContext.moveTo(trailCanvas.width/2-trailCanvas.width/2*0.8,trailCanvas.height*0.2);
				trailContext.lineTo(trailCanvas.width/2-trailCanvas.width/2*0.8,trailCanvas.height*0.8);
				trailContext.stroke();
			}
			
			else if (checkbox_upwards.checked==true){
				trailContext.textAlign="left";
				trailContext.textBaseline="middle";
				trailContext.fillText("s=-" + abs_max_displacement.toPrecision(3) + "m",trailCanvas.width*0.65+5, trailCanvas.height/2+trailCanvas.height/2*0.8);
				trailContext.fillText("s=" + abs_max_displacement.toPrecision(3) + "m",trailCanvas.width*0.65+5, trailCanvas.height/2-trailCanvas.height/2*0.8);
				
				trailContext.fillText("3 s.f.",trailCanvas.width*0.65+5, trailCanvas.height/2+trailCanvas.height/2*0.8+12);
				trailContext.fillText("3 s.f.",trailCanvas.width*0.65+5, trailCanvas.height/2-trailCanvas.height/2*0.8+12);
				
				trailContext.setLineDash([2, 2]);
				trailContext.beginPath();
				trailContext.moveTo(trailCanvas.width*0.35, trailCanvas.height/2+trailCanvas.height/2*0.8);
				trailContext.lineTo(trailCanvas.width*0.65, trailCanvas.height/2+trailCanvas.height/2*0.8);
				trailContext.moveTo(trailCanvas.width*0.35, trailCanvas.height/2-trailCanvas.height/2*0.8);
				trailContext.lineTo(trailCanvas.width*0.65,trailCanvas.height/2-trailCanvas.height/2*0.8);
				trailContext.stroke();
			}
			
	
		}
		
		
		function getNumberFieldsFilled() {
			number_filled = 0;
			if (ip_initial_u.value!="")
			{
				number_filled++;
			}
			if (ip_final_v.value!="")
			{
				number_filled++;
			}
			if (ip_acceleration_a.value!="")
			{
				number_filled++;
			}
			if (ip_time_t.value!="")
			{
				number_filled++;
			}
			if (ip_displacement_s.value!="")
			{
				number_filled++;
			}
		}

		
		// move the object by a single time step:
        function moveObject() {
            var dt = t/100;             // total animation time you want divided by total time of motion
			t_current += dt;
			if (t_current > t) {t_current = t;}
			s_current = u*t_current + 0.5*a*t_current*t_current;
			v_current = u +a*t_current;
			drawDisplacementGraph();
			drawVelocityGraph();
			drawObject();
            if (t_current < t) {   // if motion isn't complete
                timer = window.setTimeout(moveObject, 1000/Number(animation_speed.value));     // come back (call same function again) in 1/60 second (default)
            }            
        }
		
		function pause_resume_animation() { // toggle pause/resume button and pause/resume accordingly
			var button_value = document.getElementById("pause_resume_button").value;
			if (button_value=="Pause"){
				window.clearTimeout(timer);	
				document.getElementById("pause_resume_button").value="Resume";
			}
			
			if (button_value=="Resume"){
				moveObject();	
				document.getElementById("pause_resume_button").value="Pause";
			}
			
		}
		
		function pause_animation() {
			window.clearTimeout(timer);			
		}
		
		function resume_animation() {
			moveObject();			
		}
		
		// draw the object at its current location:
        function drawObject() {
			if (checkbox_right.checked==true){
				animation_current_status.innerHTML="Current Displacement s: " + s_current + "m<br/>Current Time t: " + t_current + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelX = theCanvas.width/2 + s_current/abs_max_displacement*theCanvas.width/2*0.8;
				var pixelY = theCanvas.height/2;
				theContext.beginPath();
				theContext.arc(pixelX, pixelY, 20, 0, 2*Math.PI); // change first 2 arguments to pixelX and pixelY
				var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, 20); // make ball 'shiny' with gradient
				theGradient.addColorStop(0, "#ffd0d0");
				theGradient.addColorStop(1, "#ff0000");
				theContext.fillStyle = theGradient;
				theContext.fill();
			}
			
			else if (checkbox_upwards.checked==true){
				animation_current_status.innerHTML="Current Displacement s: " + s_current + "m<br/>Current Time t: " + t_current + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelX = theCanvas.height/2 - s_current/abs_max_displacement*theCanvas.height/2*0.8;
				var pixelY = theCanvas.width/2;
				theContext.beginPath();
				theContext.arc(pixelY, pixelX, 20, 0, 2*Math.PI); // change first 2 arguments to pixelX and pixelY
				var theGradient = theContext.createRadialGradient(pixelY-1, pixelX-2, 1, pixelY, pixelX, 20); // make ball 'shiny' with gradient
				theGradient.addColorStop(0, "#ffd0d0");
				theGradient.addColorStop(1, "#ff0000");
				theContext.fillStyle = theGradient;
				theContext.fill();
			}
			/*
            trailContext.fillStyle = "black"; // for drawing trail
            trailContext.fillRect(pixelX-0.5, pixelY-0.5, 1, 1); // for drawing trail
			*/
			
        }
		
		// draw the object and starting line at center:
        function drawObjectCenter() {
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			
            var pixelX = theCanvas.width/2;
            var pixelY = theCanvas.height/2;
            
			//draw object which is a ball in this case
			theContext.beginPath();
            theContext.arc(pixelX, pixelY, 20, 0, 2*Math.PI); 
			var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, 20); // make ball 'shiny' with gradient
            theGradient.addColorStop(0, "#ffd0d0");
            theGradient.addColorStop(1, "#ff0000");
            theContext.fillStyle = theGradient;
            theContext.fill();
						
			trailContext.font = "12px Arial";
			trailContext.textAlign="center";
			
			if (checkbox_right.checked==true){
				trailContext.textAlign="top";
				trailContext.textBaseline="middle";
				trailContext.fillText("s=0m",trailCanvas.width/2,trailCanvas.height-8);
				
				//draw line at center to indicate object starting position
				trailContext.setLineDash([5, 0]);
				trailContext.beginPath(); 
				trailContext.moveTo(theCanvas.width/2, theCanvas.height*0.2);
				trailContext.lineTo(theCanvas.width/2, theCanvas.height*0.8);
				trailContext.stroke();
			}
			else if (checkbox_upwards.checked==true){
				trailContext.textAlign="left";
				trailContext.textBaseline="middle";
				trailContext.fillText("s=0m",trailCanvas.width*0.65+5,trailCanvas.height/2);
				
				//draw line at center to indicate object starting position
				trailContext.setLineDash([5, 0]);
				trailContext.beginPath(); 
				trailContext.moveTo(theCanvas.width*0.35, theCanvas.height/2);
				trailContext.lineTo(theCanvas.width*0.65, theCanvas.height/2);
				trailContext.stroke();
			}
		}

  
		// run this when calculations cannot be done
		function errorEvent() {
			alert("Error, solution cannot be calculated. This case may not be valid. Please re-enter values.");
			clearAll();
			
		}
		
		function toggleSolution1(){
			if (checkbox1.checked==true){
				checkbox2.checked=false;
			}
			if (checkbox1.checked==false){
				checkbox2.checked=true;
			}
			show_uas_vas_solution();
		}
		
		function toggleSolution2(){
			if (checkbox2.checked==true){
				checkbox1.checked=false;
			}
			if (checkbox2.checked==false){
				checkbox1.checked=true;
			}

			show_uas_vas_solution();
		}
		
		function show_uas_vas_solution() {
			window.clearTimeout(timer);     // first clear any motion in progress
			clearAll();
			solution_checkboxes.style.display="inline";
			drawObjectCenter(); // make sure object is still there since we are not drawing it in animation
			if (ip_initial_u.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!=""){
				display_2_solutions_v_notice.style.display="inline";
				if (checkbox1.checked==true){
					v = v_pos;
					t = t1;
				}
				else if (checkbox2.checked==true){
					v = v_neg;
					t = t2
				}
				if (t1>=0 && t2>=0){
				display_2_v_t_interpretation.style.display="inline";
				}
				else {
				display_2_v_t_interpretation.style.display="none";
				}
				display_calculated_values.innerHTML="Final velocity v = " + v + "ms<sup>-1</sup>" +"<br/>"+ "Time t = " + t + "s";
				display_calculated_values.style.display="inline";
				display_explanation_1.innerHTML="In this case, substitute your known u, a and s values into the equation <br/> <br/> <b>v<sup>2</sup> = u<sup>2</sup> + 2as <br></b> <br/> <br/> to get final velocity v = " + v + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, a and s.";
				if (t<0){
					display_explanation_2.innerHTML="In this case, the simplest way to get t (final unknown variable) is to substitute u, v and s into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t<br></b> <br/> <br/> to get time t = " + t + "s. Since time is negative solution is invalid. REJECT THIS VALUE OF v AND t.";
				}
				else{
					display_explanation_2.innerHTML="In this case, the simplest way to get t (final unknown variable) is to substitute u, v and s into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t<br></b> <br/> <br/> to get time t = " + t + "s.";
				}
			}
			else if (ip_final_v.value!="" && ip_acceleration_a.value!="" && ip_displacement_s.value!=""){
				display_2_solutions_u_notice.style.display="inline";
				if (checkbox1.checked==true){
					u = u_pos;
					t = t1;
				}
				else if (checkbox2.checked==true){
					u = u_neg;
					t = t2
				}
			
				if (t1>=0 && t2>=0){
				display_2_u_t_interpretation.style.display="inline";
				}
				else {
				display_2_u_t_interpretation.style.display="none";
				}
				display_calculated_values.innerHTML="Initial velocity u = " + u + "ms<sup>-1</sup>" +"<br/>"+ "Time t = " + t + "s";
				display_calculated_values.style.display="inline";
				display_explanation_1.innerHTML="In this case, substitute your known v, a and s values into the equation <br/> <br/> <b>v<sup>2</sup> = u<sup>2</sup> + 2as <br></b> <br/> <br/> to get initial velocity u = " + u + "ms<sup>-1</sup>.<br/><br/>Now you know u, v, a and s.";
				if (t<0){
					display_explanation_2.innerHTML="In this case, the simplest way to get t (final unknown variable) is to substitute u, v and s into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t<br></b> <br/> <br/> to get time t = " + t + "s. Since time is negative solution is invalid. REJECT THIS VALUE OF v AND t.";
				}
				else{
					display_explanation_2.innerHTML="In this case, the simplest way to get t (final unknown variable) is to substitute u, v and s into the equation <br/> <br/> <b>s = <sup>1</sup>/<sub>2</sub> (u+v) t<br></b> <br/> <br/> to get time t = " + t + "s.";
				}
			}
				solution_header.style.display="inline";
				display_explanation_header.style.display="inline";
				display_explanation_middle.style.display="inline";				
				display_explanation_1.style.display="inline";
				display_explanation_2.style.display="inline";
				start_animation_and_draw_graph();
				
				
		}
		
		function generate_description() {
			if (u>0){
				initial_velocity_direction="moving to the right/upwards";
			}
			else if (u<0){
				initial_velocity_direction="moving to the left/downwards";
			}
			else if (u==0){
				initial_velocity_direction="at rest";
			}
			if (u>0){
				initial_velocity_sign="positive";
			}
			else if (u<0){
				initial_velocity_sign="negative";
			}
			else if (u==0){
				initial_velocity_sign="zero";
			}
			if (v>0){
				final_velocity_direction="moving to the right/upwards";
			}
			else if (v<0){
				final_velocity_direction="moving to the left/downwards";
			}
			else if (v==0){
				final_velocity_direction="at rest";
			}
			if (v>0){
				final_velocity_sign="positive";
			}
			else if (v<0){
				final_velocity_sign="negative";
			}
			else if (v==0){
				final_velocity_sign="0";
			}
			if (a*u>0){
				decelerate_accelerate="accelerates all the way till the current time (and is still accelerating)";
			}
			else if (a*u<0){
				decelerate_accelerate="decelerates";
			}
			else if (a==0){
				decelerate_accelerate="continues to moves with uniform velocity";
			}
			if (a*u>0){
				acceleration_u_opp_same_sign="of the same sign as u, hence same direction as u";
			}
			else if (a*u<0){
				acceleration_u_opp_same_sign="of opposite sign compared to u, hence opposite direction compared to u";
			}
			else if (a==0){
				acceleration_u_opp_same_sign="0";
			}
			if (v*u>0){
				v_u_opp_same_sign="of the same sign as u, hence same direction as u";
			}
			else if (v*u<0){
				v_u_opp_same_sign="of opposite sign compared to u, hence opposite direction compared to u";
			}
			else if (v==0){
				v_u_opp_same_sign="0";
			}

			motion_description1.innerHTML="Object is initially "+ initial_velocity_direction + ".";
			motion_description1a.innerHTML="Object is initially "+ initial_velocity_direction + ".";
			motion_inference1.innerHTML="Initial velocity u is "+ initial_velocity_sign + ".";
			motion_description2.innerHTML="It then "+ decelerate_accelerate + ".";
			motion_description2a.innerHTML="It then "+ decelerate_accelerate + ".";
			motion_inference2.innerHTML="Acceleration a is "+ acceleration_u_opp_same_sign + ".";
			
			if (a*u<0){
				if(v*u<0){
					motion_description3.innerHTML="It slows down until it is momentarily at rest (velocity 0) before it changes direction and starts " + final_velocity_direction + ", before arriving at the current location at this current time t.";
					motion_description3a.innerHTML="It slows down until it is momentarily at rest (velocity 0) before it changes direction and starts " + final_velocity_direction + ", before arriving at the current location at this current time t.";
				}
				if(v*u>0){
					motion_description3.innerHTML="At the current time t, it is slowing down (decelerating) but still moving in the same direction as its initial velocity.";
					motion_description3a.innerHTML="At the current time t, it is slowing down (decelerating) but still moving in the same direction as its initial velocity.";
				}
				if(v==0){
					motion_description3.innerHTML="It has come to rest at the current time t. (Note that right after this t it will start moving in the opposite direction.)";
					motion_description3a.innerHTML="It has come to rest at the current time t. (Note that right after this t it will start moving in the opposite direction.)";
				}
				motion_inference3.innerHTML="Final velocity v is "+ v_u_opp_same_sign + ".";
			}
			else {
				motion_description3.innerHTML="";
				motion_description3a.innerHTML="";
				motion_inference3.innerHTML="";
			}
			
			description_of_motion.style.display="inline";
			inference_of_motion.style.display="inline";
			
			
			
		}
		