import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab } from 'react-bootstrap';

import EmbarkJS from 'Embark/EmbarkJS';
import DSN from './components/socialnetwork';
import Blockchain from './components/blockchain';
import Whisper from './components/whisper';
import Storage from './components/storage';

import './dapp.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      whisperEnabled: false,
      storageEnabled: false
    }

    this.setWeb3 = this.setWeb3.bind(this);
  }

  setWeb3(web3) {
    this.setState({web3});
  }

  componentDidMount(){ 
    EmbarkJS.onReady(() => {
      if (EmbarkJS.isNewWeb3()) {
        EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, version) => { 
          if(!err)
              this.setState({whisperEnabled: true})
            else
              console.log(err);
        });
      } else {
        if (EmbarkJS.Messages.providerName === 'whisper') {
          EmbarkJS.Messages.getWhisperVersion((err, version) => {
            if(!err)
              this.setState({whisperEnabled: true})
            else
              console.log(err);
          });
        }
      }

      this.setState({
        storageEnabled: true
      });
    });
  }


  _renderStatus(title, available){
    let className = available ? 'pull-right status-online' : 'pull-right status-offline';
    return <React.Fragment>
      {title} 
      <span className={className}></span>
    </React.Fragment>;
  }

  render(){
    return (<div><h3>Decentralized Social Network using Embark - Usage Example</h3>
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title='Decentralized Social Network'>
          <DSN />
        </Tab>
        <Tab eventKey={2} title='Blockchain'>
          <Blockchain />
        </Tab>
        <Tab eventKey={3} title={this._renderStatus('Decentralized Storage', this.state.storageEnabled)}>
          <Storage enabled={this.state.storageEnabled} />
        </Tab>
        <Tab eventKey={4} title={this._renderStatus('P2P communication (Whisper/Orbit)', this.state.whisperEnabled)}>
          <Whisper enabled={this.state.whisperEnabled} />
        </Tab>
      </Tabs>
    </div>);
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
