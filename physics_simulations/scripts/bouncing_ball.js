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
		var ip_initial_h = document.getElementById("ip_initial_h");
		var animation_speed = document.getElementById("animation_speed");
        var h0, u, v, h, t;                          // variables
		var h_max;     								// max height at which object can reach
		var m = 1; 									// default mass of object is 1kg
		var h_min = 0;								// min height is 0
		var TE_min = 0;								// min energy is 0
		var v_max;									// max v (at h=0m)
		var t_max;
		var v_min;
		var g = -10;								// acceleration due to gravity, in sec sch it is -10ms^-2
		var t_current = 0;							// current time of object motion when animation is playing
		var t_bounce = 0;							// time into each bounce
		var h_current;
		var v_current;
		var PE_current;
		var KE_current;
		var TE_current;
		var TE_max;
        var timer;                                  // for animation timing
		var ball_radius = 20;
		var padding = 10;
		
		var pause_resume_button = document.getElementById("pause_resume_button");

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
		
		var checkbox_right = document.getElementById("checkbox_right");
		var checkbox_upwards = document.getElementById("checkbox_upwards");
		
		var display_energy_loss = document.getElementById("display_energy_loss");
		var ip_energy_loss = document.getElementById("ip_energy_loss");
		
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
		var x_offset = 30;
		var y_offset = 20;
		var t_previous;
		var h_previous;
		var v_previous;
		var TE_previous;
		var PE_previous;
		var KE_previous;
		var multiple_t_max = 4; // higher the number, motion over greater time shown in graphs
		var displacement_graph = document.getElementById("displacement_graph");
		var displacementContext = displacement_graph.getContext('2d');  
		var velocity_graph = document.getElementById("velocity_graph");
		var velocityContext = velocity_graph.getContext('2d');  
		var energy_graph = document.getElementById("energy_graph");
		var energyContext = energy_graph.getContext('2d');  
		var displacement_axis = document.getElementById("displacement_axis");
		var displacementAxisContext = displacement_graph.getContext('2d');  
		var velocity_axis = document.getElementById("velocity_axis");
		var velocityAxisContext = velocity_graph.getContext('2d');  
		var energy_axisaxis = document.getElementById("energy_axis");
		var energyAxisContext = energy_graph.getContext('2d');  
		var energy_graph_key = document.getElementById("energy_graph_key");
		var energy_key_Context = energy_graph_key.getContext('2d');  

		var previous_cycle;
		var current_cycle;
		
		checkbox1.checked = true;
		checkbox_right.checked = false; 
		// no need to delete checkbox_right
		// checkbox_right is hidden but present in code, checking it and unchecking the below checkbox will convert 'upwards' to 'rightwards'
		// keep checkbox_right present so code can be easily adapted to horizontal displacement of ball in future
		// eg: shoot ball from a spring horizontally etc.
		checkbox_upwards.checked = true;
		resizeCanvas();
		//resize_whole_body();
		resetAll();
		display_calculated_values.style.display="none";
		
		device_size.innerHTML="Device width: " + window.innerWidth + ", height: " + window.innerHeight;
		
		initializeEnergyGraphKey(); // show the line represented of PE,KE and TE in energy-time graph
		
		var energy_loss = Number(ip_energy_loss.value);
		
		function show_energy_loss(){
			display_energy_loss.innerHTML = ip_energy_loss.value + "%"
		}
		
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
				theCanvas.height=300;
				trailCanvas.height=300;
			}
			else {
				theCanvas.width=550;
				trailCanvas.width=550;
				theCanvas.height=300;
				trailCanvas.height=300;
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
			t_bounce = 0;
			t_current = 0;
			drawObjectBottom();
			//solution_header.style.display="none";
			//display_calculated_values.style.display="none";
			//display_explanation_header.style.display="none";
			//display_explanation_1.style.display="none";
			//display_explanation_middle.style.display="none";
			//display_explanation_2.style.display="none";
			//display_solution_not_valid.style.display="none";
			//display_2_solutions_u_notice.style.display="none";
			//display_2_solutions_v_notice.style.display="none";
			//display_2_u_t_interpretation.style.display="none";
			//display_2_v_t_interpretation.style.display="none";
			//description_of_motion.style.display="none";
			//inference_of_motion.style.display="none";
			//solution_checkboxes.style.display="none";
			
			animation_current_status.innerHTML="Current Height h: 0m<br/>Current Time t: 0s";
			initializeDisplacementGraph();
			initializeVelocityGraph();
			initializeEnergyGraph();

		
		

		}
		
		function clearAllValues(){
			ip_initial_u.value="";
			ip_initial_h.value="";
			
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
            return (val/(multiple_t_max*t_max) *(displacement_graph.width - xPadding - x_offset) + xPadding); 
			// current time over total time * total height of line graph
			// xPadding needed to make space for labelling of y-axis
			// x_offset needed so graph will not go out of canvas
        }
            
        // Return the y pixel for a graph point for displacement
        function getYPixel_displacement(val) {
            return (displacement_graph.height - yPadding - (((val-h_min)/(h_max-h_min))*(displacement_graph.height - yPadding - y_offset)));
        }
		
        
		function drawAxisDisplacement() {        
			displacementAxisContext.lineWidth = 2;
			displacementAxisContext.strokeStyle = '#333';
			displacementAxisContext.font = 'bold 10pt sans-serif';
			displacementAxisContext.textAlign = "center";
			displacementAxisContext.textBaseline = "top";
			
			// title of graph // label above center of y-axis, not center of whole canvas
			displacementAxisContext.fillText("Displacement-Time Graph", (displacement_graph.width-xPadding)/2+xPadding, 0);
			
			displacementAxisContext.textAlign = "left";
					
			// draw the axes
			arrow(displacementAxisContext, xPadding, displacement_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			displacementAxisContext.fillText("h", xPadding+6, 0);
			
			displacementAxisContext.textAlign = "right";
			displacementAxisContext.textBaseline = "bottom";
			
			// x axis (shifts according to where is y = 0)
			if (h_max==undefined){
				arrow(displacementAxisContext, xPadding-5, displacement_graph.height - yPadding, displacement_graph.width, displacement_graph.height - yPadding, false, true );
				//displacementAxisContext.lineTo(displacement_graph.width, displacement_graph.height - yPadding); //x-axis
				displacementAxisContext.fillText("t", displacement_graph.width, displacement_graph.height - yPadding - 5);
			}
	
			else if (h_max!=undefined){
				arrow(displacementAxisContext, xPadding-5, getYPixel_displacement(0), displacement_graph.width, getYPixel_displacement(0), false, true);
				displacementAxisContext.fillText("t", displacement_graph.width, getYPixel_displacement(0) - 5);
			}
			displacementAxisContext.stroke();
		}
		
		function labelAxisDisplacement() {
				displacementAxisContext.font = 'italic 8pt sans-serif';
				displacementAxisContext.textAlign = "right";
                displacementAxisContext.textBaseline = "top";
				
                //label origin
				//displacementAxisContext.fillText(0, xPadding-5, getYPixel_displacement(0));
				
				displacementAxisContext.font = 'italic 8pt sans-serif';
				displacementAxisContext.textAlign = "center";
                displacementAxisContext.textBaseline = "alphabetic";
				
                // label x axis values
                for(var i = 0; i < 4; i ++) {
                   
                    displacementAxisContext.fillText(((multiple_t_max*t_max/3*i+current_cycle*multiple_t_max*t_max)).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) + 20);
					// mark out the axis
					displacementAxisContext.strokeStyle = '#000';
					displacementAxisContext.beginPath();
					displacementAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) - 5 );
					displacementAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_displacement(0) + 5);
				   	displacementAxisContext.stroke();
                }
                
               // label y axis values
				displacementAxisContext.textAlign = "right";
                displacementAxisContext.textBaseline = "middle";
                
                for(var i = 0; i < 4; i ++) {
                    displacementAxisContext.fillText((h_max/3*i).toPrecision(3), xPadding - 10, getYPixel_displacement((h_max/3*i)));
					// mark out the axis
					displacementAxisContext.strokeStyle = '#000';
					displacementAxisContext.beginPath();
					displacementAxisContext.moveTo(xPadding - 5, getYPixel_displacement((h_max/3*i)));
					displacementAxisContext.lineTo(xPadding + 5, getYPixel_displacement((h_max/3*i)));
				   	displacementAxisContext.stroke();
                }
		}
		
				
		function initializeDisplacementGraph() {
			displacementAxisContext.clearRect(0, 0, displacement_graph.width, displacement_graph.height);
			drawAxisDisplacement();
			labelAxisDisplacement();
			t_previous = 0;
			h_previous = h0;
		}

		function drawDisplacementGraph() {
				
				
                
                displacementContext.strokeStyle = '#f00';
                
                // Draw the line graph point by point
                displacementContext.beginPath();


                current_cycle = Math.floor((getXPixel(t_previous) - xPadding) / (displacement_graph.width - xPadding - x_offset));


                if (getXPixel(t_current) <= getXPixel(t_max)){
	                displacementContext.moveTo(getXPixel(t_previous), getYPixel_displacement(h_previous));
	              
	                displacementContext.lineTo(getXPixel(t_current), getYPixel_displacement(h_current));
               	}

          		

               	else {

               		if (current_cycle > previous_cycle) {
               			displacementContext.clearRect(0, 0, displacement_graph.width, displacement_graph.height);
               			//previous_cycle = current_cycle;
               			drawAxisDisplacement();
               			labelAxisDisplacement();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (displacement_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (displacement_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			displacementContext.moveTo((getXPixel(t_previous) - xPadding) % (displacement_graph.width - xPadding - x_offset ) + xPadding, getYPixel_displacement(h_previous));
	              
	                	displacementContext.lineTo((getXPixel(t_current) - xPadding) % (displacement_graph.width - xPadding - x_offset ) + xPadding , getYPixel_displacement(h_current));
	                }
               	}

                displacementContext.stroke();
				
				//t_previous = t_current; 
				//don't put t_previous = t_current first as drawVelocityGraph() still needs this previous value
				h_previous = h_current;
                

        }

		/*
		
		function drawDisplacementGraph() {
				
				
                
                displacementContext.strokeStyle = '#f00';
                
                // Draw the line graph point by point
                displacementContext.beginPath();

                if (getXPixel(t_current) < displacement_graph.width){
	                displacementContext.moveTo(getXPixel(t_previous), getYPixel_displacement(h_previous));
	              
	                displacementContext.lineTo(getXPixel(t_current), getYPixel_displacement(h_current));
               	}

               	else {
               		var step_before_max = ((((multiple_t_max-1)*t_max)+t_max*49/50)/(multiple_t_max*t_max) *(displacement_graph.width - x_offset - xPadding ) + x_offset+ xPadding);
               		var two_step_before_max = ((((multiple_t_max-1)*t_max)+t_max*48/50)/(multiple_t_max*t_max) *(displacement_graph.width - x_offset - xPadding ) + x_offset+xPadding);
               		var first_step = ((t_max*1.4/50)/(multiple_t_max*t_max) *(displacement_graph.width - x_offset - xPadding ) +xPadding);

               		var imageData = displacementContext.getImageData(first_step, 0, displacement_graph.width - first_step, displacement_graph.height - yPadding);
					displacementContext.putImageData(imageData, xPadding, 0);
					
					// now clear the right-most pixels:
					displacementContext.clearRect(step_before_max, 0, displacement_graph.width - step_before_max, displacement_graph.height);

					displacementContext.moveTo(two_step_before_max, getYPixel_displacement(h_previous));
	              
	                displacementContext.lineTo(step_before_max, getYPixel_displacement(h_current));
               	}

                displacementContext.stroke();
				
				//t_previous = t_current; 
				//don't put t_previous = t_current first as drawVelocityGraph() still needs this previous value
				h_previous = h_current;
                

        }
		*/

        /*
        function drawDisplacementGraph() {
				
				
                
                displacementContext.strokeStyle = '#f00';
                
                // Draw the line graph point by point
                displacementContext.beginPath();

                if (getXPixel(t_current) <= displacement_graph.width){
	                displacementContext.moveTo(getXPixel(t_previous), getYPixel_displacement(h_previous));
	              
	                displacementContext.lineTo(getXPixel(t_current), getYPixel_displacement(h_current));
               	}

               	else {
               		var first_step = ((t_max/50)/(multiple_t_max*t_max) *(displacement_graph.width - xPadding - x_offset) + xPadding);

               		var imageData = displacementContext.getImageData(xPadding + 1, 0, displacement_graph.width - xPadding -1, displacement_graph.height - yPadding);
					displacementContext.putImageData(imageData, xPadding, 0);
					
					// now clear the right-most pixels:
					displacementContext.clearRect(displacement_graph.width-1, 0, 1, displacement_graph.height);

					displacementContext.moveTo(displacement_graph.width-2, getYPixel_displacement(h_previous));
	              
	                displacementContext.lineTo(displacement_graph.width-1, getYPixel_displacement(h_current));
               	}

                displacementContext.stroke();
				
				//t_previous = t_current; 
				//don't put t_previous = t_current first as drawVelocityGraph() still needs this previous value
				h_previous = h_current;
                

        }
		*/
		
	//###############VELOCITY GRAPH
		
		
            
        // Return the y pixel for a graph point for velocity
        function getYPixel_velocity(val) {
            return (velocity_graph.height - yPadding - (((val+v_max)/(2*v_max))*(velocity_graph.height - yPadding - y_offset)));
        }
		
        
		function drawAxisVelocity() {        
			velocityAxisContext.lineWidth = 2;
			velocityAxisContext.strokeStyle = '#333';
			velocityAxisContext.font = 'bold 10pt sans-serif';
			velocityAxisContext.textAlign = "center";
			velocityAxisContext.textBaseline = "top";
			
			// title of graph // label above center of y-axis, not center of whole canvas
			velocityAxisContext.fillText("Velocity-Time Graph", (velocity_graph.width-xPadding)/2+xPadding, 0);
			
			velocityAxisContext.textAlign = "left";
					
			// draw the axes
			arrow(velocityAxisContext, xPadding, velocity_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			velocityAxisContext.fillText("v", xPadding+6, 0);
			
			velocityAxisContext.textAlign = "right";
			velocityAxisContext.textBaseline = "bottom";
			
			// x axis (shifts according to where is y = 0)
			if (v_max==undefined){
				arrow(velocityAxisContext, xPadding-5, velocity_graph.height - yPadding, velocity_graph.width, velocity_graph.height - yPadding, false, true );
				//velocityAxisContext.lineTo(velocity_graph.width, velocity_graph.height - yPadding); //x-axis
				velocityAxisContext.fillText("t", velocity_graph.width, velocity_graph.height - yPadding - 5);
			}
	
			else if (v_max!=undefined){
				arrow(velocityAxisContext, xPadding-5, getYPixel_velocity(0), velocity_graph.width, getYPixel_velocity(0), false, true);
				velocityAxisContext.fillText("t", velocity_graph.width, getYPixel_velocity(0) - 5);
			}
			velocityAxisContext.stroke();
		}
		
		function labelAxisVelocity() {
				velocityAxisContext.font = 'italic 8pt sans-serif';
				velocityAxisContext.textAlign = "right";
                velocityAxisContext.textBaseline = "top";
				
                //label origin
				//velocityAxisContext.fillText(0, xPadding-5, getYPixel_velocity(0));
				
				velocityAxisContext.font = 'italic 8pt sans-serif';
				velocityAxisContext.textAlign = "center";
                velocityAxisContext.textBaseline = "alphabetic";
				
				if (t_max!=undefined){
					// label x axis values
					for(var i = 0; i < 4; i ++) {
					  
						velocityAxisContext.fillText(((multiple_t_max*t_max/3*i)+current_cycle*multiple_t_max*t_max).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) + 20);
						// mark out the axis
						velocityAxisContext.strokeStyle = '#000';
						velocityAxisContext.beginPath();
						velocityAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) - 5 );
						velocityAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_velocity(0) + 5);
						velocityAxisContext.stroke();
					}
				}
                
                // label y axis values
				velocityAxisContext.textAlign = "right";
                velocityAxisContext.textBaseline = "middle";

                	velocityAxisContext.fillText((0).toPrecision(3), xPadding - 10, getYPixel_velocity(0));
					// mark out the axis
					velocityAxisContext.strokeStyle = '#000';
					velocityAxisContext.beginPath();
					velocityAxisContext.moveTo(xPadding - 5, getYPixel_velocity((2*v_max/3*i-v_max)));
					velocityAxisContext.lineTo(xPadding + 5, getYPixel_velocity((2*v_max/3*i-v_max)));
				   	velocityAxisContext.stroke();
                
                for(var i = 0; i < 4; i ++) {
                    velocityAxisContext.fillText((2*v_max/3*i-v_max).toPrecision(3), xPadding - 10, getYPixel_velocity((2*v_max/3*i-v_max)));
					// mark out the axis
					velocityAxisContext.strokeStyle = '#000';
					velocityAxisContext.beginPath();
					velocityAxisContext.moveTo(xPadding - 5, getYPixel_velocity((2*v_max/3*i-v_max)));
					velocityAxisContext.lineTo(xPadding + 5, getYPixel_velocity((2*v_max/3*i-v_max)));
				   	velocityAxisContext.stroke();
                }
		}
		
				
		function initializeVelocityGraph() {
		
			velocityAxisContext.clearRect(0, 0, velocity_graph.width, velocity_graph.height);
			drawAxisVelocity();
			labelAxisVelocity();
			t_previous = 0;
			v_previous = u;
		}
		
		function drawVelocityGraph() {
				
				
        
	        velocityContext.strokeStyle = '#f00';

	        // Draw the line graph point by point
	        velocityContext.beginPath();
	        if (getXPixel(t_current) <= getXPixel(t_max)){
	                velocityContext.moveTo(getXPixel(t_previous), getYPixel_velocity(v_previous));
	              
	                velocityContext.lineTo(getXPixel(t_current), getYPixel_velocity(v_current));
               	}

          		

               	else {

               		if (current_cycle > previous_cycle) {
               			velocityContext.clearRect(0, 0, velocity_graph.width, velocity_graph.height);
               			//previous_cycle = current_cycle;
               			drawAxisVelocity();
               			labelAxisVelocity();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			velocityContext.moveTo((getXPixel(t_previous) - xPadding ) % (velocity_graph.width - xPadding - x_offset) + xPadding, getYPixel_velocity(v_previous));
	              
	                	velocityContext.lineTo((getXPixel(t_current) - xPadding) % (velocity_graph.width - xPadding - x_offset) + xPadding , getYPixel_velocity(v_current));
	                }
               	}
	       
	        velocityContext.stroke();
			
			//t_previous = t_current; // don't do first as energy graph still needs this value
			v_previous = v_current;
                

        }


	//###############ENERGY GRAPH

		function initializeEnergyGraphKey(){
			
			energy_key_Context.font = '9pt sans-serif';
			energy_key_Context.textAlign = "left";
			energy_key_Context.textBaseline = "middle";

			energy_key_Context.lineWidth = 2;

			energy_key_Context.strokeStyle = 'grey';
			arrow(energy_key_Context, xPadding, 10, xPadding+30, 10,  false, false);
			energy_key_Context.fillText("Total Energy", xPadding+30+10, 10);

			energy_key_Context.setLineDash([2, 2]);
			energy_key_Context.strokeStyle = 'red';
			arrow(energy_key_Context, xPadding, 20, xPadding+30, 20,  false, false);
			energy_key_Context.fillText("Potential Energy", xPadding+30+10, 20);

			energy_key_Context.setLineDash([2, 0]);
			energy_key_Context.strokeStyle = 'blue';
			arrow(energy_key_Context, xPadding, 30, xPadding+30, 30,  false, false);
			energy_key_Context.fillText("Kinetic Energy", xPadding+30+10, 30);

  
		}
            
        // Return the y pixel for a graph point for energy
        function getYPixel_energy(val) {
            return (energy_graph.height - yPadding - (((val-TE_min)/(TE_max-TE_min))*(energy_graph.height - yPadding - y_offset)));
        }
		
        
		function drawAxisEnergy() {        
			energyAxisContext.lineWidth = 2;
			energyAxisContext.strokeStyle = '#333';
			energyAxisContext.font = 'bold 10pt sans-serif';
			energyAxisContext.textAlign = "center";
			energyAxisContext.textBaseline = "top";
			
			// title of graph // label above center of y-axis, not center of whole canvas
			energyAxisContext.fillText("Energy-Time Graph", (energy_graph.width-xPadding)/2+xPadding, 0);
			
			energyAxisContext.textAlign = "left";
					
			// draw the axes
			arrow(energyAxisContext, xPadding, energy_graph.height - yPadding + 5, xPadding, 0,  false, true); // y axis (doesn't shift)
			energyAxisContext.font = 'bold 8pt sans-serif';
			energyAxisContext.fillText("energy", xPadding+6, 0);
			
			energyAxisContext.textAlign = "right";
			energyAxisContext.textBaseline = "bottom";
			energyAxisContext.font = 'bold 10pt sans-serif';
			// x axis (shifts according to where is y = 0)
			if (TE_max==undefined){
				arrow(energyAxisContext, xPadding-5, energy_graph.height - yPadding, energy_graph.width, energy_graph.height - yPadding, false, true );
				//energyAxisContext.lineTo(energy_graph.width, energy_graph.height - yPadding); //x-axis
				energyAxisContext.fillText("t", energy_graph.width, energy_graph.height - yPadding - 5);
			}
	
			else if (TE_max!=undefined){
				arrow(energyAxisContext, xPadding-5, getYPixel_energy(0), energy_graph.width, getYPixel_energy(0), false, true);
				energyAxisContext.fillText("t", energy_graph.width, getYPixel_energy(0) - 5);
			}
			energyAxisContext.stroke();
		}
		
		function labelAxisEnergy() {
				energyAxisContext.font = 'italic 8pt sans-serif';
				energyAxisContext.textAlign = "right";
                energyAxisContext.textBaseline = "top";
				
                //label origin
				//energyAxisContext.fillText(0, xPadding-5, getYPixel_energy(0));
				
				energyAxisContext.font = 'italic 8pt sans-serif';
				energyAxisContext.textAlign = "center";
                energyAxisContext.textBaseline = "alphabetic";
				
                // label x axis values
                for(var i = 0; i < 4; i ++) {
                   
                    energyAxisContext.fillText(((multiple_t_max*t_max/3*i)+current_cycle*multiple_t_max*t_max).toPrecision(3), getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) + 20);
					// mark out the axis
					energyAxisContext.strokeStyle = '#000';
					energyAxisContext.beginPath();
					energyAxisContext.moveTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) - 5 );
					energyAxisContext.lineTo(getXPixel(multiple_t_max*t_max/3*i), getYPixel_energy(0) + 5);
				   	energyAxisContext.stroke();
                }
                
               // label y axis values
               // only need to label once although we are plotting TE, KE and PE as all have same max and min range
				energyAxisContext.textAlign = "right";
                energyAxisContext.textBaseline = "middle";
                
                for(var i = 0; i < 4; i ++) {
                    energyAxisContext.fillText((TE_max/3*i).toPrecision(3), xPadding - 10, getYPixel_energy((TE_max/3*i)));
					// mark out the axis
					energyAxisContext.strokeStyle = '#000';
					energyAxisContext.beginPath();
					energyAxisContext.moveTo(xPadding - 5, getYPixel_energy((TE_max/3*i)));
					energyAxisContext.lineTo(xPadding + 5, getYPixel_energy((TE_max/3*i)));
				   	energyAxisContext.stroke();
                }
		}
		
				
		function initializeEnergyGraph() {
			energyAxisContext.clearRect(0, 0, energy_graph.width, energy_graph.height);
			drawAxisEnergy();
			labelAxisEnergy();
			t_previous = 0;
			h_previous = h0;
		}
		
		function drawEnergyGraph() {
				
				
                //###############total energy
                energyContext.strokeStyle = 'grey'; 
                
                // Draw the line graph point by point
                energyContext.beginPath();
                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(TE_previous));
	              
	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(TE_current));
               	}

          		

               	else {

               		if (current_cycle > previous_cycle) {
               			energyContext.clearRect(0, 0, energy_graph.width, energy_graph.height);
               			previous_cycle = current_cycle;
               			drawAxisEnergy();
               			labelAxisEnergy();

               		}
 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding- x_offset ) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding- x_offset ) + xPadding, getYPixel_energy(TE_previous));
	              
	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(TE_current));
	                }
               	}
               
                energyContext.stroke();
				
								
				TE_previous = TE_current;


				 //###############potential energy
				energyContext.setLineDash([2, 2]);
				energyContext.strokeStyle = 'red'; 
                
                // Draw the line graph point by point
                energyContext.beginPath();
                                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(PE_previous));
	              
	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(PE_current));
               	}

          		

               	else {


 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding, getYPixel_energy(PE_previous));
	              
	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(PE_current));
	                }
               	}
                energyContext.stroke();
				
							
				PE_previous = PE_current;


				//###############kinetic energy
				energyContext.setLineDash([2, 0]);
				energyContext.strokeStyle = 'blue'; 
                
                // Draw the line graph point by point
                energyContext.beginPath();
                                 if (getXPixel(t_current) <= getXPixel(t_max)){
	                energyContext.moveTo(getXPixel(t_previous), getYPixel_energy(KE_previous));
	              
	                energyContext.lineTo(getXPixel(t_current), getYPixel_energy(KE_current));
               	}

          		

               	else {


 					if(Math.abs((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding)-((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding) < 100 ){
               			energyContext.moveTo((getXPixel(t_previous) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding, getYPixel_energy(KE_previous));
	              
	                	energyContext.lineTo((getXPixel(t_current) - xPadding) % (energy_graph.width - xPadding - x_offset) + xPadding , getYPixel_energy(KE_current));
	                }
               	}
               
                energyContext.stroke();
				
				t_previous = t_current; 
				
				KE_previous = KE_current;
                

        }
		
////////////////////// end of functions for drawing graphs /////////////////////////
		
	document.addEventListener("keydown", function (e) { // calculate when enter is pressed
		if (e.keyCode === 13) {
			calculateAll();
		}
	});
        // calculate all the u,v,a,t,s values based on 3 inputs
        function calculateAll() {
        	previous_cycle = 0;
        	current_cycle = 0;
			clearAll();
            window.clearTimeout(timer);     // first clear any motion in progress
			theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
			drawObjectBottom(); // make sure object is still there since we are not drawing it in animation
			
			
			
			if (!(ip_initial_u.value!="" && ip_initial_h.value!="")) {
				alert("Please enter both the initial velocity and the initial height values.");
			}
			else if (ip_initial_u.value!="" && ip_initial_h.value!="") {
				if (ip_initial_h.value <0){
					alert("Please enter only positive values for height.");
				}
				else {
					u = Number(ip_initial_u.value);
					h0 = Number(ip_initial_h.value);
					h_max = u*u/(2*(-1*g)) + h0;				// g is negative so negative it to make it positive
					h_min = 0;
					h_previous = h0;    // to plot the first value in displacement graph
					v_max = Math.sqrt(u*u + -2*g*h0); 	// g is negative so negative it to make it positive

					t_max = 3*h_max/v_max; 
					// this is just a time which is divided by some value to determine the time step dt to prevent animation from running too slowly or quickly
					// if h_max or u inputs are changed

					TE_max = m*(-g)*h_max; // this is the maximum total energy throughout motion i.e. TE before ball has bounced
					PE_previous = m*(-g)*h0;    // to plot the first value in potential energy graph
					KE_previous = 0.5 * m * u * u;    // to plot the first value in kinetic energy graph
					TE_previous = PE_previous + KE_previous;    // to plot the first value in total energy graph
					
					solution_header.innerHTML = t_max + "," + v_max;
					drawHeights();
					initializeDisplacementGraph();
					initializeVelocityGraph();
					initializeEnergyGraph();
					moveObject();
					//generate_description();
				}
			}
            

        }
				
		
			
		// move the object by a single time step dt:
        function moveObject() {
            
			
			h_current = h0 + u*t_bounce + 0.5*g*t_bounce*t_bounce; // using s = ut + 1/2 at^2, with initial displacement = h0
			v_current = u + g*t_bounce; // using v = u + at
			var current_v_max = Math.sqrt(u*u + -2*g*h0); // v_max for the current bounce, v_max occurs when mgh is 0 i.e. at ground level
			
			var dt = t_max/50;      
			t_current += dt; // current time throughout all the bounces
			t_bounce += dt; // current time during this bounce

			
            if (h_current < 0) {   // if ball has reached ground
            	// energy loss is in percentage so divide by 100, v_max is a positive value, bounces up
            	// sqrt because velocity squared is energy
            	v_current = -current_v_max; 
                u = current_v_max*(Math.sqrt(Number(100-ip_energy_loss.value)/100)); 
				h0 = 0;
				h_current = 0;
				t_bounce = 0;
            } 

            PE_current = m*(-g)*h_current;
			KE_current = 0.5 * m * v_current * v_current;
			TE_current = PE_current + KE_current;
			
			drawObject();	
			drawDisplacementGraph();
			drawVelocityGraph();	
			drawEnergyGraph();		
			timer = window.setTimeout(moveObject, 1000/Number(animation_speed.value));     // come back (call same function again) in 1/60 second (default)			
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
			if (checkbox_right.checked==true){ // ignore for now, this is just present in case we want animation to be aligned horizontally in some other simulation
				animation_current_status.innerHTML="Current Displacement s: " + h_current + "m<br/>Current Time t: " + t_current + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelX = h_current/h_max*theCanvas.width*0.8;
				var pixelY = theCanvas.height/2;
				theContext.beginPath();
				theContext.arc(pixelX, pixelY, ball_radius, 0, 2*Math.PI); // change first 2 arguments to pixelX and pixelY
				var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius); // make ball 'shiny' with gradient
				theGradient.addColorStop(0, "#ffd0d0");
				theGradient.addColorStop(1, "#ff0000");
				theContext.fillStyle = theGradient;
				theContext.fill();
			}
			
			else if (checkbox_upwards.checked==true){
				animation_current_status.innerHTML="Current Displacement s: " + h_current.toPrecision(5) + "m<br/>Current Time t: " + t_current.toPrecision(5) + "s";
				theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
				var pixelY = theCanvas.height-(h_current/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius);
				var pixelX = theCanvas.width/2;
				theContext.beginPath();
				theContext.arc(pixelX, pixelY, ball_radius, 0, 2*Math.PI); // change first 2 arguments to pixelX and pixelY
				var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius); // make ball 'shiny' with gradient
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
        function drawObjectBottom() {
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
			
            var pixelX = theCanvas.width/2;
            var pixelY = theCanvas.height/2;
            
			//draw object which is a ball in this case
			theContext.beginPath();
            //theContext.arc(pixelX, pixelY, 20, 0, 2*Math.PI); 
			var theGradient = theContext.createRadialGradient(pixelX-1, pixelY-2, 1, pixelX, pixelY, ball_radius); // make ball 'shiny' with gradient
            theGradient.addColorStop(0, "#ffd0d0");
            theGradient.addColorStop(1, "#ff0000");
            theContext.fillStyle = theGradient;
            theContext.fill();
						
			trailContext.font = "12px Arial";
			trailContext.textAlign="center";
			
			if (checkbox_right.checked==true){ // ignore for now, this is just present in case we want animation to be aligned horizontally in some other simulation
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
				trailContext.fillText("h=0m",trailCanvas.width*0.65+padding,trailCanvas.height-padding);
				
				//draw line at center to indicate object starting position
				trailContext.setLineDash([5, 0]);
				trailContext.beginPath(); 
				trailContext.moveTo(theCanvas.width*0.35, trailCanvas.height-padding);
				trailContext.lineTo(theCanvas.width*0.65, trailCanvas.height-padding);
				trailContext.stroke();
			}
		}
		
		function drawHeights() { // label the initial height h0 and max height the object can reach
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
	           
						
			trailContext.font = "12px Arial";
			trailContext.textAlign="center";
			
			if (checkbox_right.checked==true){ // ignore for now, this is just present in case we want animation to be aligned horizontally in some other simulation
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
					trailContext.fillText("max height="+h_max+"m",trailCanvas.width*0.65+padding,padding+2*ball_radius);
					
					trailContext.setLineDash([2, 3]);
					trailContext.beginPath(); 
					trailContext.moveTo(theCanvas.width*0.35, padding+2*ball_radius);
					trailContext.lineTo(theCanvas.width*0.65, padding+2*ball_radius);
					trailContext.stroke();
					
					
					trailContext.textAlign="right";
					trailContext.textBaseline="middle";
					trailContext.fillText("initial height="+h0+"m",trailCanvas.width*0.35-padding,theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);
					
					trailContext.setLineDash([2, 3]);
					trailContext.beginPath(); 
					trailContext.moveTo(theCanvas.width*0.35, theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);
					trailContext.lineTo(theCanvas.width*0.65, theCanvas.height-(h0/h_max*(theCanvas.height-2*padding-2*ball_radius)+padding+ball_radius)+ball_radius);
					trailContext.stroke();
				
				
				
			}
		}

  
		// run this when calculations cannot be done
		function errorEvent() {
			alert("Error, solution cannot be calculated. This case may not be valid. Please re-enter values.");
			clearAll();
			
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
		