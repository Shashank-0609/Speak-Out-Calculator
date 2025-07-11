
    const display = document.getElementById("display");
    const voiceBtn = document.getElementById("voice-btn");
    const historyList = document.getElementById("history-list");
    let currentInput = "";
    let history = [];

    function updateHistory(expression, result) {
      const log = `${expression} = ${result}`;
      history.unshift(log);
      if (history.length > 10) history.pop();
      renderHistory();
    }

    function renderHistory() {
      historyList.innerHTML = history.map(item => `<div class="history-log">${item}</div>`).join('');
    }

    document.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (value === "AC") {
          currentInput = "";
        } else if (value === "DEL") {
          currentInput = currentInput.slice(0, -1);
        } else if (value === "=") {
          try {
            const result = eval(currentInput).toString();
            updateHistory(currentInput, result);
            currentInput = result;
          } catch {
            currentInput = "Error";
          }
        } else if (value === "square") {
          try {
            const result = (eval(currentInput) ** 2).toString();
            updateHistory(currentInput + "²", result);
            currentInput = result;
          } catch {
            currentInput = "Error";
          }
        } else {
          currentInput += value;
        }

        display.value = currentInput;
      });
    });

    // Voice input logic using Web Speech API
    voiceBtn.addEventListener("click", () => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = event => {
        let voiceInput = event.results[0][0].transcript.toLowerCase();

        voiceInput = voiceInput
          .replace(/plus/g, "+")
          .replace(/minus/g, "-")
          .replace(/(times|multiplied by)/g, "*")
          .replace(/(divide|divided by)/g, "/")
          .replace(/(modulo|modulus|mod)/g, "%")
          .replace(/square/g, "**2")
          .replace(/(equals|equal to|is)/g, "=")
          .replace(/(point|dot)/g, ".");

        try {
          if (voiceInput.includes("=")) {
            const expression = voiceInput.split("=")[0];
            const result = eval(expression).toString();
            updateHistory(expression, result);
            currentInput = result;
          } else {
            const result = eval(voiceInput).toString();
            updateHistory(voiceInput, result);
            currentInput = result;
          }
        } catch {
          currentInput = "Error";
        }

        display.value = currentInput;
      };

      recognition.onerror = () => {
        display.value = "Voice Error";
      };
    });