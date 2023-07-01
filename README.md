# KitKuts

Various shortcuts/macros for VSCode

## Installation

### From VSCode

File -> Preferences -> Extensions -> Search for "kitkuts", install

### Build it yourself

```
# from the repo base
sudo npm install -g vsce
npm install
vsce package
```

This should pop out a `kitkuts-1.0.X.vsix` file

### (Developer) Upload a new version:
1. `vsce package`
2. go to https://marketplace.visualstudio.com/manage/publishers/kitkennedy
3. Right click the extension and choose "update" from the menu

#### Installation via command line

```code --install-extension kitkuts.vsix```

#### Installation from VSCode GUI

In VSCode, Press `Control+Shift+X` to navigate to extensions manager.
Then click on the actions menu, and select `Install from vsix`.

## Keystrokes

* Alt+Up/Down - jump to previous/next line with the same indentation level (or within the same indention block)
* Alt+Shift+Up/Down - same as above, but extending selection/highlight

## Issues/pull requests

https://github.com/apollokit/vscode-kitkuts