<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_POST['input_text'])) {
	$text = $_POST['input_text'];
	$file = fopen('input.txt', 'a'); // open the file in append mode
	fwrite($file, $text); // write the text to the file
	fclose($file);
	// close the file
}

$file = 'input.txt';

if (isset($_POST['delete'])) {
	$handle = fopen($file, 'w');
	fclose($handle);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// handle form submission
	// ...

	// redirect to a new page to avoid resubmission
	header('Location: index.php');
	exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<title>Spellchecker</title>
	<link rel="stylesheet" href="main.css">
</head>

<form class="hidden">
	<label for="uploadButton">Upload file:</label>
	<input type="file" id="upload-button" class="inputFile" accept=".txt" />
	<br />
	<label for="output-file">Output file name:</label>
	<input type="text" id="output-file" />
	<br />
</form>

<body>

<div class="wrapper">
<div class="container">
		<h1>Spellchecker</h1>
		<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
			<textarea placeholder="Enter you text ... " name="input_text"></textarea>
			<br>
			<div class="buttons">
			<input class="button"  type="submit" value="Save to File">
			<input class="button" type="submit"  name="delete" value="Delete Text from File">
			<button class="button" type="button" id="download-button" disabled>
				Download Corrected File
			</button>
			</div>
		</form>
	</div>

	<div class="result" id="result" class="hidden">
		<div class="inputres">
			<h2>Input text:</h2>
			<div class="in" id="input"></div>
		</div>

		<div class="outputres">
			<h2>Corrected text:</h2>
			<div class="out" id="output"></div>
		</div>
	</div>

</div>

	<script src="main.js" defer></script>
</body>

</html>