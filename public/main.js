var messageInput = document.getElementById('message');//reference to the INPUT element
var messageList = document.getElementById('message-list');//reference the to message list (UL)
var statusMsg = document.getElementById('status');//reference to the status paragraph

//timeout variable which keeps the 2s timeout while chatbot is typing
var chatbotTimeout;

// INTERVIEW QUESTIONS:
//     'Can you tell me a little about yourself?',
//     'How did you hear about the position?',
//     'What do you know about the company?',
//     'Why do you want this job?',
//     'Why should we hire you?',
//     'What are your greatest professional strengths?',
//     'What do you consider to be your weaknesses?',
//     'What is your greatest professional achievement?',
//     'Tell me about a challenge or conflict you\'ve faced at work, and how you dealt with it',
//     'Where do you see yourself in five years?',
//     'Why are you leaving your current job? (Please write "N/A" if not applicable)',
//     'What are you looking for in a new position?',
//     'What type of work environment do you prefer?',
//     'Describe a time where you exercised leadership?',
//     'Has there ever been a time where you disagreed with a decision that was made at work?',
//     'How would your boss and co-workers describe you? (Please write "N/A" if not applicable)',
//     'How do you deal with pressure or stressful situations?',
//     'What are your salary requirements?',
//     'Do you have any questions for us?'


var show = function (elem) {
	elem.style.display = 'block';
};

var hide = function (elem) {
	elem.style.display = 'none';
};

var toggle = function (elem) {

	// If the element is visible, hide it
	console.log(elem)
	if (window.getComputedStyle(elem).display === 'block') {
		hide(elem);
		return;
	}

	// Otherwise, show it
	show(elem);

};

// Listen for click events
document.getElementById('toggler').addEventListener('click', function (event) {
	// Prevent default link behavior
	event.preventDefault();

	// Get the content
	var content = document.querySelector(event.currentTarget.hash);
	if (!content) return;

	// Toggle the content
	toggle(content);

}, false);

//object with some fake responses
var botResponses = {
	"Hey" : "Hey there! How are you?", "hey" : "Hey there! How are you?", "Hi" : "Hey there! How are you?", "hi" : "Hey there! How are you?", "Hello" : "Hey there! How are you?", "hello" : "Hey there! How are you?",

	"doing well" : "Great to hear! Are you ready for your interview?", "doing good" : "Great to hear! Are you ready for your interview?", "doing fine" : "Great to hear! Are you ready for your interview?", "doing alright" : "Great to hear! Are you ready for your interview?", "not bad" : "Great to hear! Are you ready for your interview?", "not too bad" : "Great to hear! Are you ready for your interview?",

	"Yes" : "Great! Let's get started, shall we?", "yes" : "Great! Let's get started, shall we?",

  "Okay" : "Can you tell me a little about yourself?", "okay" : "Can you tell me a little about yourself?", "ok" : "Can you tell me a little about yourself?", "OK" :
	"Can you tell me a little about yourself?", "Ok" : "Can you tell me a little about yourself?", "Sure" : "Can you tell me a little about yourself?", "sure" : "Can you tell me a little about yourself?",

  "I am" : "How did you hear about the position?", "about myself" : "How did you hear about the position?", "my experience" : "How did you hear about the position?", "I have" : "How did you hear about the position?",

	"this position" : "What do you know about the company?", "I heard" : "What do you know about the company?",
	"company" : "What are your greatest professional strengths?", "about this company" : "What do you know about the company?", "referral" : "What do you know about the company?", "job board" : "What do you know about the company?", "careers page" : "What do you know about the company?", "jobs board" : "What do you know about the company?", "job listing" : "What do you know about the company?",

	"the company" : "What are your greatest professional strengths?", "The company" : "What are your greatest professional strengths?",

	"greatest" : "What do you consider to be your weaknesses?", "strengths" : "What do you consider to be your weaknesses?", "strength" : "What do you consider to be your weaknesses?",

	"weakness" : "What is your greatest professional achievement?", "weaknesses" : "What is your greatest professional achievement?",

	"achievement" : "'Tell me about a challenge or conflict you have faced at work, and how you dealt with it',",

	"challenge" : "Where do you see yourself in five years?", "conflict" : "Where do you see yourself in five years?", "dealt" : "Where do you see yourself in five years?",

	"five" : "What are you looking for in a new position?", "5" : "What are you looking for in a new position?", "see myself" : "What are you looking for in a new position?", "predict" : "What are you looking for in a new position?",


	"am looking for" : "What type of work environment do you prefer?", "new position" : "What type of work environment do you prefer?", "new role" : "What type of work environment do you prefer?", "next job" : "What type of work environment do you prefer?", "next role" : "What type of work environment do you prefer?", "looking for" : "What type of work environment do you prefer?", "new job" : "What type of work environment do you prefer?",

	"work environment" : "Describe a time where you exercised leadership?", "environment" : "Describe a time where you exercised leadership?", "dynamic" : "Describe a time where you exercised leadership?", "culture" : "Describe a time where you exercised leadership?", "atmosphere" : "Describe a time where you exercised leadership?",

	"leadership" : "How would your boss and co-workers describe you?", "exercised" : "How would your boss and co-workers describe you?", "practiced" : "How would your boss and co-workers describe you?", "leader" : "How would your boss and co-workers describe you?",

	"describe me as" : "What are your salary requirements?", "would say that I am" : "What are your salary requirements?", "my boss" : "What are your salary requirements?", "would say that I" : "What are your salary requirements?",

	"salary" : "Do you have any questions for us?", "pay" : "Do you have any questions for us?", "$" : "Do you have any questions for us?", "budget" : "Do you have any questions for us?", "negotiate" : "Do you have any questions for us?", "negotiable" : "Do you have any questions for us?",

	"?" : "Thank you for your time today. Your question(s) has been recorded and the recruiter will follow up with you within 3-5 business days. Take care.",

	"Bye" : "Goodbye", "bye" : "Goodbye", "Goodbye" : "Goodbye", "goodbye" : "Goodbye", "Take care" : "Goodbye", "take care" : "Goodbye", "thank you" : "Goodbye", "Thank you" : "Goodbye"
}

//when the button on a keyboard is pressed
messageInput.addEventListener('keyup', function(e){
	//check if the button pressed was ENTER (13 is the code for ENTER)
	if (e.which == 13){
		//remove the timeout, so that chatbot waits for a new message
		clearTimeout(chatbotTimeout);
		//save the value of the message
		var msg = this.value;
		//if the message was empty or one character long, alert the user and return
		if (msg.length <= 1){
			alert('Please, say something...');
			return;
		}
		//else send the user's message
		sendUserMessage(this.value);
		//reset the input value to the empty string
		this.value = '';
	}
});

//function that sends user's message
//parameter: string
function sendUserMessage(msg){
	//perform put request
	fetch('/api/chatLogs', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
			'_id' : chatLogId,
      'message' : msg
    })
  }).then(response => {
    if (response.ok) return response.json()
  }).then(data => {
    console.log(data)
  })
	//append the message to the list
	appendMessage(msg, 'You');
	//initiate the bot message
	sendBotMessage(msg);
}

//function that appends the message item to the list
//parameters: string, string
function appendMessage(msg, sender){
	//create a new LI DOM element
	var msgItem = document.createElement('LI');
	//set it's html
	msgItem.innerHTML = '<b>' + sender + ': </b>' + msg;
	//add the appropriate classes
	msgItem.className = 'message ' + sender + '-message';
	//add it to the DOM
	messageList.appendChild(msgItem);
}

//function that sends bot's message
//parameter: string
function sendBotMessage(userMsg){
	//set the status text
	statusMsg.innerHTML = 'Interviewer is typing...';
	//create a new timeout
	chatbotTimeout = setTimeout(function(){
		//create the fake response message, by providing user's last message
		var msg = getBotMessage(userMsg);
		//append the fake response to the list
		appendMessage(msg, 'Interviewer');
		//reset the status
		statusMsg.innerHTML = '';

	}, 2000);
}

//create the fake bot response function
//parameter string
function getBotMessage(userMsg){
	//for each key in the fake responses object
	for (var key in botResponses){
		//check if the user's message contains that key
		if (userMsg.indexOf(key) > -1){
			console.log(botResponses[key], key)
			//if it does, return the corresponding fake response
			return botResponses[key];
		}
	}

	//if no keyword is recognized, just return generic response
	return 'Umm, idk what to say here...sorry ';
}
