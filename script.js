// We can define here the behavior for the elements on the website...

// URL for POST requests
const gptEndpoint = 'https://api.openai.com/v1/completions';

// Fetch DOM elements
const reqButton = document.getElementById('button-request');
const reqStatus = document.getElementById('request-status');

// Attach click behavior to the button
reqButton.onclick = function () {
  // Disable request button to prevent duplicate requests
  reqButton.disabled = true;
  // Give some feedback to user
  reqStatus.innerHTML = "Request started...";

  // Fetch image request data
  const key = document.getElementById('api-key').value;
  const prompt = document.getElementById('text-prompt').value;
  const radios = document.getElementsByName('text-model');
  let model;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      model = radios[i].value;
      break;
    }
  }
//   const tokens = Number(document.getElementById('token-count').value);
//   const temp = Number(document.getElementById('temperature').value);

  // We won't do error-checking here, will leave that up to the server...

  // Form the request body according to the API:
  // https://api.openai.com/v1/completions
  const reqBody = {
    model: model,
    prompt: prompt,
    max_tokens: 256,
    temperature: 0.1,
    top_p: 0.5,
    stream: false,
    logprobs: null,
    // stop: "\n"  // this was returning empty completions
  };  

  // Form the data for a POST request:
  const reqParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(reqBody)
  }

  // Use the Fetch API to do an async POST request to OpenAI:
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  fetch(gptEndpoint, reqParams)
    .then(res => res.json())
    .then(json => addText(json, prompt))
    .catch(error => {
      reqStatus.innerHTML = error;
      reqButton.disabled = false;
    });
}



/**
 * Add prompts + answers to the page.
 * @param {Object} jsonData The text completion API response
 * @param {String} prompt The original prompt that generated the text completion
 * @returns 
 */
function addText(jsonData, prompt) {
  console.log(jsonData);

  // Enable request button for further requests
  reqButton.disabled = false;

  // Handle a possible error response from the API
  if (jsonData.error)
  {
    reqStatus.innerHTML = 'ERROR: ' + jsonData.error.message;
    return;
  }

  // Parse the response object and attach a new text field to the page.
  const container = document.getElementById('text-container');
  for (let i = 0; i < jsonData.choices.length; i++) 
  {
    // Prompt text box
    const questionDiv = document.createElement('div');
    questionDiv.className = "question";
    const questionP = document.createElement('p');
    questionP.innerHTML = prompt;
    questionDiv.appendChild(questionP);

    // Answer text box
    const textData = jsonData.choices[i].text;
    const answerDiv = document.createElement('div');
    answerDiv.className = "answer";
    const answerP = document.createElement('p');
    answerP.innerHTML = textData;
    answerDiv.appendChild(answerP);

    // Reason text box
    let reasonData;
    switch (jsonData.choices[i].finish_reason)
    {
      case "length":
        reasonData = "(Text generation stopped due to text length)"
        break;
      case "stop":
        reasonData = "<END>"
        break;
      default:
        reasonData = "(Text generation stopped due to unknown reasons)"
        break;
    }
    const reasonDiv = document.createElement('div');
    reasonDiv.className = "reason";
    const reasonP = document.createElement('div');
    reasonP.innerHTML = reasonData;
    reasonDiv.appendChild(reasonP);

    // Prepend them at the top of the container
    container.prepend(
      questionDiv, 
      answerDiv,
      reasonDiv  
    );
  }

  // Log some feedback
  reqStatus.innerHTML = jsonData.choices.length +' responses received for "' + prompt + '"';
}

var textContainer = document.getElementById("text-container");
var speakerButton = document.getElementById("speaker-button");
var speaking = false;

speakerButton.addEventListener("click", function() {
  if (speaking) {
    window.speechSynthesis.pause();
    speakerButton.innerHTML(<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4.5h-.75v15H9v-15Z"></path>
    <path d="M15.75 4.5H15v15h.75v-15Z"></path>
  </svg>);
    speaking = false;
  } else {
    speakerButton.innerHTML(<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.122 2.448S15.061 7.5 11.25 7.5h-7.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 .75.75h7.5c3.81 0 7.872 5.073 7.872 5.073.284.375 1.128.119 1.128-.46V2.906c0-.577-.797-.882-1.128-.458Z"></path>
    <path d="M3 12s-.75-.281-.75-1.5C2.25 9.281 3 9 3 9"></path>
    <path d="M21 11.531s.75-.203.75-1.031c0-.828-.75-1.031-.75-1.031"></path>
    <path d="M12 7.5v6"></path>
    <path d="M5.25 7.5v6"></path>
    <path d="M6.75 13.5v7.875a.375.375 0 0 0 .375.375h2.484a.75.75 0 0 0 .717-.972C9.933 19.518 9 18.098 9 15.75h.75a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75H9"></path>
  </svg>)
    var text = textContainer.textContent;
    var utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    speaking = true;
  }
});
