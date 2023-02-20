function edits1(word) {
  const alphabet = "aăâbcdefghiîjklmnopqrsștțuvwxyz";
  const splits = [];
  for (let i = 0; i <= word.length; i++) {
    splits.push([word.slice(0, i), word.slice(i)]);
  }
  const deletes = splits
    .filter(([a, b]) => b.length > 0)
    .map(([a, b]) => a + b.slice(1));
  const transposes = splits
    .filter(([a, b]) => b.length > 1)
    .map(([a, b]) => a + b[1] + b[0] + b.slice(2));
  const replaces = splits
    .filter(([a, b]) => b.length > 0)
    .flatMap(([a, b]) => alphabet.split("").map((c) => a + c + b.slice(1)));
  const inserts = splits.flatMap(([a, b]) =>
    alphabet.split("").map((c) => a + c + b)
  );
  return [...deletes, ...transposes, ...replaces, ...inserts];
}

function known(words, dictionary) {
  return words.filter((word) => dictionary.has(word));
}

function candidates(word, dictionary) {
  const isPunctuation = [',', '.', '/', '?'].includes(word[word.length - 1]);
  if (isPunctuation) {
    return [word];
  }

  const knownWords = known([word], dictionary);
  if (knownWords.length > 0) {
    return knownWords;
  }

  const edits = edits1(word);
  const knownEdits = known(edits, dictionary);
  const candidates = knownEdits.length > 0 ? knownEdits : edits.flatMap(edits2 => known(edits1(edits2), dictionary));
  return candidates.length > 0 ? candidates.sort((a, b) => dictionary.get(b) - dictionary.get(a)) : [word];
}



function probability(word, dictionary) {
  const count = dictionary.get(word) || 0;
  const totalWords = Array.from(dictionary.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  return count / totalWords;
}

// Spellcheck a text file and write corrected text to output file
async function spellCheck(inputFile, outputFile) {
  // Load dictionary file and count frequency of each word
  let dictionaryText = localStorage.getItem("dictionary");
  if (!dictionaryText) {
    const response = await fetch("dictionary.txt");
    dictionaryText = await response.text();
    localStorage.setItem("dictionary", dictionaryText);
  }
  const dictionary = new Map(
    dictionaryText
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split("\t"))
      .map(([word, count]) => [word, parseInt(count)])
  );

  // Load input file
  const response = await fetch(inputFile);
  const inputFileText = await response.text();
  const inputWords = inputFileText.trim().split(/\s+/);

  const outputWords = [];
  for (let i = 0; i < inputWords.length; i++) {
    const candidatesList = candidates(inputWords[i], dictionary);
    const correctedWord =
      candidatesList.length > 0 ? candidatesList[0] : inputWords[i];
    outputWords.push(correctedWord);

    const outputWord = document.createElement("span");
    outputWord.textContent = correctedWord;
    if (correctedWord !== inputWords[i]) {
      outputWord.classList.add("corrected");
    }
    document.getElementById("output").appendChild(outputWord);

    const inputWord = document.createElement("span");
    inputWord.textContent = inputWords[i];
    if (correctedWord !== inputWords[i]) {
      inputWord.classList.add("misspelled");
    }
    document.getElementById("input").appendChild(inputWord);

    // Write corrected word to output

    // Add a space after the word
    document.getElementById("input").appendChild(document.createTextNode(" "));
    if (i < inputWords.length - 1) {
			document.getElementById("input").appendChild(document.createTextNode(" "));
			document.getElementById("output").appendChild(document.createTextNode(" "));
		}
		
  }

  // Show corrected text and enable download button
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("download-button").disabled = false;
}

// Add event listener for upload button
document
  .getElementById("upload-button")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (file.type !== "text/plain") {
      alert("Please upload a plain text file");
      return;
    }
    await spellCheck(file);
  });

// Add event listener for download button
document
  .getElementById("download-button")
  .addEventListener("click", function () {
    const outputFile = document.getElementById("output-file").value;
    const outputText = document.getElementById("output").textContent;
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = outputFile;
    link.click();
  });

	

spellCheck("input.txt", "output.txt");

