// modified from original at https://github.com/mltony/vscode-kitkuts

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setFlagsFromString } from 'v8';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let kitkuts = new KitKuts();
	console.log('kitkuts is now active!');
	// vscode.window.showInformationMessage('kitkuts is now active!');

	let cycleWord = vscode.commands.registerCommand('kitkuts.cycleWord', () => {
		kitkuts.cycleWord();
	});
	context.subscriptions.push(cycleWord);
}

export function deactivate() {}

class KitKuts {

	/**
	* Find the current word(s) under the cursor/selection in a line of text
	*
	* @remarks
	*  	- will return a streak of multiple words if the current highlight includes
	*		 parts of multiple
	*
	* @param line - the Line of text
	* @param currStartIdx - start of selection in text
	* @param currEndIdx - end of selection in text
	*/
	public identifyWordsBoundsInString(line: string, currStartIdx: number, currEndIdx: number): 
			[string, number, number] {
		
		function isWordChar(char: string): boolean {
			let code = char.charCodeAt(0);
			if ((code > 47 && code < 58) || // numeric (0-9)
			        (code > 64 && code < 91) || // upper alpha (A-Z)
					(code > 96 && code < 123) || // lower alpha (a-z)
					(char === '_') ||
					(char === '-')
					) {
				return true;
			}
			return false;
		}
		
		currStartIdx = currStartIdx - 1;
		while (currStartIdx > 0) {
			let char = line.charAt(currStartIdx);
			if (!isWordChar(char)) {break;}
			currStartIdx -= 1;
		}
		currStartIdx += 1;
		
		currEndIdx = currEndIdx;
		while (currEndIdx < line.length) {
			let char = line.charAt(currEndIdx);
			if (!isWordChar(char)) {break;}
			currEndIdx += 1;
		}
		currEndIdx -= 1;
		
		let word = line.slice(currStartIdx, currEndIdx+1);
		console.log("word: '" + word + "', len " + word.length);

		return [word, currStartIdx, currEndIdx];
	}

	/**
	* Cycle to next logical word for a word that is currently highlighted
	*
	* @param forwards - TODO implement this....direction (forwards is higher line numbers)
	*/
	public cycleWord(forwards: boolean = true) {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		// finds a replacement word for each selection
		let replaceSelections: Array<[vscode.Selection, string]> = [];
		for (const sel of editor.selections) {
			// start line of selection
			let iCurrLineStart = sel.start.line;
			let iCurrLineEnd = sel.end.line;
			// start char of first line of selection
			let startChar = sel.start.character;
			let endChar = sel.end.character;
			
			// if the selection spans multiple lines, skip it
			if (iCurrLineEnd > iCurrLineStart) { continue; }

			let line = editor.document.lineAt(iCurrLineEnd);

			// console.log("line: " + line.text);
			// console.log("startChar: " + startChar);
			// console.log("endChar: " + endChar);

			let [word, wordStartChar, wordEndChar] = this.identifyWordsBoundsInString(
				line.text, startChar, endChar);

			
			// hardcode these for now
			// TODO: make this more flexible...maybe use a state machine representation?
			let newWord = word;
			if (word === 'True') {newWord = 'False';}
			if (word === 'False') {newWord = 'True';}
			if (word === 'true') {newWord = 'false';}
			if (word === 'false') {newWord = 'true';}

			const pos1 = new vscode.Position(iCurrLineStart, wordStartChar);
			const pos2 = new vscode.Position(iCurrLineEnd, wordEndChar + 1);
			const replaceSelection = new vscode.Selection(pos1, pos2);

			replaceSelections.push([replaceSelection, newWord]);
		}

		editor.edit(builder => {
			for (const [replaceSelection, newWord] of replaceSelections) {
				builder.replace(replaceSelection, newWord);
			}
			// builder.replace(sel, newWord);
		});
	}
}
