let inputField = document.querySelector("input");
let sendbtn = document.querySelector("#send-button");

let jarvis = (event) => {
  // Check for Enter key press or button click
  if (event.key === "Enter" || event.type === "click") {
    let userInput = inputField.value;

    if (userInput.trim() !== "") {
      // Display user's message
      let userMessageBox = document.createElement("div");
      userMessageBox.classList.add("user-message");
      userMessageBox.appendChild(document.createTextNode(userInput));
      document.querySelector(".chatbot-body").appendChild(userMessageBox);

      inputField.value = ""; // Clear input field

      // Create loading dots element for bot message
      let botMessageBox = document.createElement("div");
      botMessageBox.classList.add("bot-message");
      botMessageBox.innerHTML = `<div class="loading-dots">
                                   <span>.</span><span>.</span><span>.</span>
                                 </div>`;
      document.querySelector(".chatbot-body").appendChild(botMessageBox);

      // Scroll to the bottom after appending new message
      let chatbotBody = document.querySelector(".chatbot-body");
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      // API key and URL
      const apiKey = 'AIzaSyBXpTRIUWF9WvpG0hjdE6c3X2vflsnmUd4';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      // Request options
      const option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userInput }] }]
        })
      };

      // Fetch function to call the API
      async function generateContent() {
        try {
          const response = await fetch(url, option);

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          
          // Replace loading dots with actual bot response
          let botResponse = data.candidates[0].content.parts[0].text;
          botMessageBox.innerHTML = ""; // Clear loading dots
          botMessageBox.appendChild(document.createTextNode(botResponse));
          
        } catch (error) {
          console.error("Error generating content:", error);
          botMessageBox.innerHTML = "Sorry, there was an error. Please try again.";
        }

        // Scroll to the bottom after bot response is added
        let chatbotBody = document.querySelector(".chatbot-body");
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }

      // Call the function to generate bot content
      generateContent();
    }
  }
};

// Add event listeners for both "Enter" key and button click
inputField.addEventListener("keydown", jarvis);
sendbtn.addEventListener("click", jarvis);
