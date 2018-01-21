
// Disable past dates

var today = new Date().toISOString().split('T')[0];
document.getElementsByName("dateInput")[0].setAttribute('min', today);

var noteDiv = document.querySelector("#note-div");

taskValidity();
dateValidity();
timeValidity();

var backup = localStorage.getItem('tasks');
	if (backup) {
		var tasks = JSON.parse(backup);
	} else {
		var tasks = [
		{
			task: "Feed the dog",
			date: "2018-01-25", 
			time: "06:00",
		},

		{
			task: "Dentist appointment",
			date: "2018-01-23", 
			time: "09:30",
		},

		{
			task: "Morning run",
			date: "2018-01-25", 
			time: "06:30",
		},

		];
	}


buildNotes(tasks);

function buildNotes(tasks) {
	var container = document.querySelector("#note-div");

	for (var i = 0; i < tasks.length; i++) {
		var tasksRow = createNote(tasks[i]);
		container.append(tasksRow);
	}
}


function createNote (arr) {
	var note = document.createElement("div");
	var text = document.createElement("p");
	var dateParagraph = document.createElement("p");
	var timeParagraph = document.createElement("p");

	var lid = document.createElement("div");
	lid.classList.add("trashLid");

	note.classList.add("note");
	text.classList.add("note-title");
	text.setAttribute("contenteditable", true);


	dateParagraph.classList.add("note-date");
	timeParagraph.classList.add("note-time");
	text.textContent = arr.task;
	dateParagraph.textContent = arr.date;
	timeParagraph.textContent = arr.time;

	note.append(lid);
	note.append(text);
	note.append(dateParagraph);
	note.append(timeParagraph);
	noteDiv.appendChild(note);

	var btn = document.createElement("button");
	btn.classList.add("btn");

	note.appendChild(btn);
	btn.addEventListener("click", deleteNote);

	// Transform the trash lid
	$(function() {
  		$('.btn').hover(function() {
    	$(".trashLid").css("transform", "translateY(-10px) rotate(-45deg)");
    	$(".trashLid").css("transition", ".5s");
        }, function() {
    		$(".trashLid").css("transform", "translateY(-1px");
    
    	});
	});

	return note;
}

function deleteNote (event) {

	var deleteBtn = event.target;
	var note = deleteBtn.parentNode;
	
	var notes = document.querySelectorAll(".note");
	for (var i = 0; i < notes.length; i++) {
		if (notes[i] == note) {
			break;
		}
	}
		$(notes[i]).animate( {backgroundColor:'yellow'}, 10).fadeOut(1000,function() {
    	$(notes[i]).remove();
	});
	var i = Array.from(notes).indexOf(note);
	tasks.splice(i, 1);

	// update the localStorage
	updateBackup(tasks);
}


document.querySelector("form").addEventListener("submit", function (event) {
	event.preventDefault();
	var form = event.target;

	var note = document.createElement("div");

	var task = form.querySelector("[name=textArea]").value;
	var date = form.querySelector("[name=dateInput]").value;
	var time = form.querySelector("[name=timeInput]").value;

	var newTaskNote = {
		task: task,
		date: date, 
		time: time,
	}


	var newTask = createNote(newTaskNote);

	noteDiv.prepend(newTask);

	tasks.unshift(newTaskNote);

	form.reset();
	taskValidity();
	dateValidity();
	timeValidity();

	// update the localStorage
	updateBackup(tasks);
	

});


function updateBackup (array) {
	localStorage.setItem('tasks', JSON.stringify(array));
}



function taskValidity() {
	var text = document.querySelector("#textArea");
	var twoCharacters = /^[a-zA-Zא-ת]{2,2}[.\s\S*?]{1,5000}$/;
	var value = text.value;

	var position = value.search(/[\u0590-\u05FF]/);
	if(position >= 0){
  		text.style.backgroundImage = "url('images/formbgHeb.jpg')";
  		text.style.paddingRight = "9%";
	} else if (position < 0) {
		text.style.backgroundImage = "url('images/formbg.jpg')";
	}

	if (twoCharacters.test(text.value) == false) {
		text.setCustomValidity("You MUST enter at least 3 characters and the first 2 MUST be letters");
	} else {
		text.setCustomValidity("");
	}
}


function dateValidity() {
	var date = document.querySelector("#dateInput");
	
	if (dateInput.value.length == 0) {
		date.setCustomValidity("You MUST enter a valid date");
	} else {
		date.setCustomValidity("");
	}
}

function timeValidity() {
	var time = document.querySelector("#timeInput");
	
	if (timeInput.value.length == 0) {
		time.setCustomValidity("You MUST enter a valid time frame");
	} else {
		time.setCustomValidity("");
	}
}


