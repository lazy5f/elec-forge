import { shell } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// App
ReactDOM.render(<App />, document.getElementById('root'));

// vshandler 등록
const VSHANDLER_VERSION = '0.7.2';
if (localStorage.getItem('vshander.version') !== VSHANDLER_VERSION) {
  shell.openPath(`${process.resourcesPath}\\vshandler\\install.bat`);
  localStorage.setItem('vshander.version', VSHANDLER_VERSION)
}
