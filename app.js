
let currentQuestionId = 1;
let questions;
let answers = [];

axios
  .get("questions.json")
  .then(response => {
    questions = response.data.questions;
    showQuestion(currentQuestionId);
  })
  .catch(error => {
    console.log(error);
  });

function showQuestion(questionId) {
  const question = questions.find(q => q.id === questionId);
  if (!question) return;
  document.getElementById("question").innerHTML = question.text;
  document.getElementById("options").innerHTML = "";
  question.options.forEach(option => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="radio" id="${option.value}" name="answer" value="${option.value}">
      <label for="${option.value}">${option.text}</label>
    `;
    document.getElementById("options").appendChild(div);
});
if (question.nextQuestionId === null) {
  document.getElementById("submit-button").style.display = "block";
  document.getElementById("next-button").style.display="none";
} else {
  document.getElementById("submit-button").style.display = "none";
  document.getElementById("next-button").style.display="block";
}
}

function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
      const answer = selected.value;
      const currentQuestion = questions.find(q => q.id === currentQuestionId);
      answers.push({question: currentQuestion.text, answer: answer});
      currentQuestionId = currentQuestion.nextQuestionId;
      showQuestion(currentQuestionId);
    }else{
      alert("Please select an option");
    }
  }
  
  function submitForm() {
    submitAnswer();
    const csv = convertArrayOfObjectsToCSV(answers);
    alert("Thank you for answering the questions!");
    window.location.href = "index.html";
    downloadCSV(csv);
  }
  
  function convertArrayOfObjectsToCSV(data) {
    let csv = "";
    const keys = Object.keys(data[0]);
    csv += keys.join(",") + "\n";
    data.forEach(item => {
      csv += keys.map(key => item[key]).join(",") + "\n";
    });
    return csv;
  }
  
  function downloadCSV(csv) {
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    link.setAttribute("download", "data.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
