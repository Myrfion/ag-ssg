/*
    Name- Anshul Gandhi
    Course- DPS 909
    Project Name- Static site Generator (SSG)
*/

//start here

import readline from 'readline';
import path from 'path';
import fs from 'fs';
export function ssg_(file, language = 'en-CA') {
	let extension = path.extname(file);
	let filename = path.basename(file);
	const dir = './dist';

	//remove directory if already exists and create new one
	if (fs.existsSync(dir)) {
		fs.rmSync(dir, { recursive: true, force: true });
	}

	// create the directory folder  if not exist
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.lstat(file, (err, stats) => {
		if (err) {
			console.log(err);
			return;
		} else {
			if (stats.isDirectory()) {
				fs.readdir(file, (err, files) => {
					files.forEach((fileN) => {
						if (err) {
							console.log(err);
							return;
						}
						if (
							path.extname(fileN) == '.txt' ||
							path.extname(fileN) == '.md'
						) {
							readFile(file + '/' + fileN).then(function (data) {
								writeFile(fileN, data, language);
							});
						}
					});
					generateIndexHtml(files, true);
				});
			} else {
				if (
					path.extname(filename) == '.txt' ||
					path.extname(filename) == '.md'
				) {
					readFile(file).then((data) => {
						writeFile(filename, data, language);
						generateIndexHtml(filename, false);
					});
				}
			}
		}
	});
}

//function to generate index.html
function generateIndexHtml(inp, Dir, language = 'en-CA') {
	var content = '';
	if (Dir) {
		for (var file of inp) {
			var htmlFile = file.substring(0, file.length - 4) + '.html';
			content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
		}
	} else {
		var htmlFile = inp.substring(0, inp.length - 4) + '.html';
		content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
	}

	const template = `<!doctype html><html lang=${language}><head><meta charset="utf-8"><title>Main Page</title><link rel="stylesheet" href="../style.css"></head>
<body>
    ${content}
</body></html>`;
	fs.writeFile('./dist/index.html', template, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log('Index file created successfully check dist folder');
	});
}

//function to read file
function readFile(file) {
	return new Promise(async (resolve, reject) => {
		let arr = [];
		const rl = readline.createInterface({
			input: fs.createReadStream(file),
		});
		//read line by line
		for await (const line of rl) {
			if (line !== '') {
				arr.push(line);
			} else {
				arr.push('\n');
			}
		}
		resolve(arr);
	});
}

//function to write file

function writeFile(filename, data, language) {
	return new Promise((resolve, reject) => {
		let content = '';
		let html = '';
		let title = filename.substring(0, filename.length - 4);
		var filedest = './dist/' + filename + '.html';
		for (var line of data) {
			if (line !== '\n') {
				// If the line starts with a '#', then check if h1 or h2.
				if (line.charAt(0) == '#') {
					// If the 2nd char is a space, then 'content' should be header1.
					if (line.charAt(1) == ' ') {
						var str = new String();
						str = line.substring(2);
						content += `<h1>${str}</h1>`;
					}
					// If the 2nd char is also a '#' and the 3rd char is a space, then 'content' should be header2.
					else if (line.charAt(1) == '#' && line.charAt(2) == ' ') {
						var str = new String();
						str = line.substring(3);
						content += `<h2>${str}</h2>`;
					}
				}
				// Otherwise, 'content' should be placed in a paragraph
				else {
					content += `<p>${line}</p>`;
					//convert --- to hr
					if (line == '---') {
						content += `<hr>`;
					}
				}
			} else {
				content += '\n';
			}
		}
		html = `
        <!doctype html><html lang= ${language}>
      <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="../style.css">
      </head>
      <body >
          ${content}
      </body>
      </html>`;
		fs.writeFile(filedest, html, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(
				'File created successfully ' +
					filename +
					'check the dist folder'
			);
		});

		resolve(html);
	});
}
