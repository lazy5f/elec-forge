import { execFile } from 'child_process';
import { ipcRenderer } from 'electron';
import * as React from 'react';

export default function App() {
  const [clientId, setClientId] = React.useState(null);

  return (
    <>
      {!clientId && (
        <div>
          <div><button onClick={() => setClientId(1)}>VM 1</button></div>
          <div><button onClick={() => setClientId(2)}>VM 2</button></div>
          <div><button onClick={() => setClientId(3)}>VM 3</button></div>
        </div>
      )}
      {clientId && <Client id={clientId} doClose={() => setClientId(null)} />}
    </>
  );
}

function Client({ id, doClose }) {
  const redirectUrl = useAgent();

  return (
    <>
      <h1>VM {id}</h1>
      <p><button onClick={() => redirectUrl('http://naver.com?abc=! ! !')}>Send URL</button></p>
      <p><button onClick={doClose}>Close</button></p>
    </>
  );
}

function useAgent() {
  const port_min = 49152;
  const port_max = 65536;
  let port = Math.floor(Math.random() * (port_max - port_min) + port_min)

  const start = () => {
    console.log(`Starting ClipAgent with port ${port}...`);

    const child = execFile('node.exe', ['d:\\temp\\elec-forge\\agent\\index.js', port]);

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error('Agent exited with error (failed to bind port?). Create agent again with next port');
        port += 1;
        start();
      } else {
        console.log('ClipAgent finished.');
      }
    });
  }

  const redirectUrl = (_e, url) => {
    console.log('Redirect URL:', url);

    fetch(`http://localhost:${port}/redirect?url=${url}`, { method: 'GET' });
  };

  React.useEffect(() => {
    start();

    ipcRenderer.on('url-redir', redirectUrl);

    return () => {
      ipcRenderer.removeListener('url-redir', redirectUrl);

      console.log('Send shutdown request to ClipAgent...');
      fetch(`http://localhost:${port}/shutdown`, { method: 'GET' });
    };
  }, []);

  return redirectUrl;
}
