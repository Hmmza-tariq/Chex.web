const pauseUI = `<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M9 4.5h-.75v15H9v-15Z"></path><path d="M15.75 4.5H15v15h.75v-15Z"></path> </svg>`;
const listeningUI = `<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M15.737 15.504C17.894 14.04 19.5 11.782 19.5 9a7.5 7.5 0 0 0-15 0v9.683c0 2.075 1.675 3.817 3.75 3.817s3.133-1.216 3.623-1.875c.692-.929 1.955-3.823 3.864-5.12Z"></path>
<path d="M7.5 14.25V8.625C7.5 6.356 9.525 4.5 12 4.5s4.5 1.856 4.5 4.125"></path>
<path d="M7.5 11.204c1.172-.844 3.742-.703 3.742-.703 1.218 0 1.93 1.379 1.218 2.372 0 0-1.728 1.987-1.962 2.878"></path>
</svg>`;
const micUI = `<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M9 21h6"></path>
<path d="M18 9.75v1.5c0 3.3-2.7 6-6 6s-6-2.7-6-6v-1.5"></path>
<path d="M12 17.25V21"></path>
<path d="M12 3a2.985 2.985 0 0 0-3 3v5.203c0 1.65 1.36 3.047 3 3.047s3-1.36 3-3.047V6c0-1.687-1.313-3-3-3Z"></path>
</svg>`;
const soundUI = `<svg width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.122 2.448S15.061 7.5 11.25 7.5h-7.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 .75.75h7.5c3.81 0 7.872 5.073 7.872 5.073.284.375 1.128.119 1.128-.46V2.906c0-.577-.797-.882-1.128-.458Z"></path>
<path d="M3 12s-.75-.281-.75-1.5C2.25 9.281 3 9 3 9"></path>
<path d="M21 11.531s.75-.203.75-1.031c0-.828-.75-1.031-.75-1.031"></path>
<path d="M12 7.5v6"></path>
<path d="M5.25 7.5v6"></path>
<path d="M6.75 13.5v7.875a.375.375 0 0 0 .375.375h2.484a.75.75 0 0 0 .717-.972C9.933 19.518 9 18.098 9 15.75h.75a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75H9"></path>
</svg>`;

var speakerButton = document.getElementById("speaker-button");
var speaking = false;
speakerButton.addEventListener("click", function () {
  var text = textContainer.textContent;
  var utterance = new SpeechSynthesisUtterance(text);
  var textContainer = document.getElementById("text-container");
  if (speaking) {
    window.speechSynthesis.pause();
    speakerButton.innerHTML = pauseUI;
    speaking = false;
  } else {
    speakerButton.innerHTML = soundUI;
    window.speechSynthesis.speak(utterance);
    speaking = true;
    utterance.addEventListener("end", function () {
      speaking = false;
    });
  }
});

var textPrompt = document.getElementById("text-prompt");
var microphoneButton = document.getElementById("microphone-button");
var recognition = new webkitSpeechRecognition() || SpeechRecognition;
var listening = false;
// microphoneButton.addEventListener("click", function () {
//   if (listening) {
//     microphoneButton.innerHTML = micUI;
//     recognition.stop();
//     listening = false;
//   } else {
//     microphoneButton.innerHTML = listeningUI;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";
//     recognition.start();
//     recognition.onresult = function (event) {
//       textPrompt.value = event.results[0][0].transcript;
//       listening = true;
//     };
//   }
// });
microphoneButton.addEventListener("click", function () {
  if (listening) {
    microphoneButton.innerHTML = micUI;
    recognition.stop();
    listening = false;
  } else {
    microphoneButton.innerHTML = listeningUI;
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      textPrompt.value = transcript;
      console.log(transcript);
    });

    if (speech == true) {
      recognition.start();
    }
    listening = true;
  }
});
// URL for POST requests
const gptEndpoint = "https://api.openai.com/v1/completions";

// Fetch DOM elements
const reqButton = document.getElementById("button-request");
const reqStatus = document.getElementById("request-status");

// Attach click behavior to the button
reqButton.onclick = function () {
  microphoneButton.innerHTML = micUI;
  // Disable request button to prevent duplicate requests
  reqButton.disabled = true;
  // Give some feedback to user
  reqStatus.innerHTML = "Request started...";

  // Fetch image request data
  const key = document.getElementById("api-key").value;
  const prompt = document.getElementById("text-prompt").value;
  const radios = document.getElementsByName("text-model");
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(reqBody),
  };

  // Use the Fetch API to do an async POST request to OpenAI:
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  fetch(gptEndpoint, reqParams)
    .then((res) => res.json())
    .then((json) => addText(json, prompt))
    .catch((error) => {
      reqStatus.innerHTML = error;
      reqButton.disabled = false;
    });
};

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
  if (jsonData.error) {
    reqStatus.innerHTML = "ERROR: " + jsonData.error.message;
    return;
  }

  // Parse the response object and attach a new text field to the page.
  const container = document.getElementById("text-container");
  for (let i = 0; i < jsonData.choices.length; i++) {
    // Prompt text box
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    const questionP = document.createElement("p");
    questionP.innerHTML = prompt;
    questionDiv.appendChild(questionP);

    // Answer text box
    const textData = jsonData.choices[i].text;
    const answerDiv = document.createElement("div");
    answerDiv.className = "answer";
    const answerP = document.createElement("p");
    answerP.innerHTML = textData;
    answerDiv.appendChild(answerP);

    // Reason text box
    let reasonData;
    switch (jsonData.choices[i].finish_reason) {
      case "length":
        reasonData = "(Text generation stopped due to text length)";
        break;
      case "stop":
        reasonData = "<END>";
        break;
      default:
        reasonData = "(Text generation stopped due to unknown reasons)";
        break;
    }
    const reasonDiv = document.createElement("div");
    reasonDiv.className = "reason";
    const reasonP = document.createElement("div");
    reasonP.innerHTML = reasonData;
    reasonDiv.appendChild(reasonP);

    // Prepend them at the top of the container
    container.prepend(questionDiv, answerDiv, reasonDiv);
  }

  // Log some feedback
  reqStatus.innerHTML =
    jsonData.choices.length + ' responses received for "' + prompt + '"';
}
