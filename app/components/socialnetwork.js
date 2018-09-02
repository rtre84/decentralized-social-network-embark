import EmbarkJS from 'Embark/EmbarkJS';
import SimpleStorage from 'Embark/contracts/SimpleStorage';
import DecentralizedSocialNetwork from 'Embark/contracts/DecentralizedSocialNetwork';
import React from 'react';
import { Form, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap';


class DSN extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // DSN related state
            accountSet: "<metamask account - should be fetched dynamically>",
            userNameSet: "admin",
            passwordSet: "admin",
            yearsOldSet: 34,
            nameSet: "Anup",
            descriptionSet: "Test",
            web3: null,

            // Storage related state
            valueSet: 10,
            valueGet: "",
            logs: []
        }

        this.setWeb3 = this.setWeb3.bind(this);
    }

    setWeb3(web3) {
        this.setState({web3});
    }

    handleChange(e){
        this.setState({valueSet: e.target.value});
    }

    setValue(e){
        e.preventDefault();

        var value = parseInt(this.state.valueSet, 10);

        // If web3.js 1.0 is being used
        if (EmbarkJS.isNewWeb3()) {
            window.EmbarkJS = EmbarkJS;
            window.DecentralizedSocialNetwork = DecentralizedSocialNetwork;
            DecentralizedSocialNetwork.methods.set(value).send({from: web3.eth.defaultAccount});
            this._addToLog("DecentralizedSocialNetwork.methods.createAccount()" +
                ".send({from: web3.eth.defaultAccount})");
        } else {
            DecentralizedSocialNetwork.set(value);
            this._addToLog("#blockchain", "DecentralizedSocialNetwork.set(" + value + ")");
        }
    }

    getValue(e){
        e.preventDefault();

        if (EmbarkJS.isNewWeb3()) {
            SimpleStorage.methods.get().call()
                .then(_value => this.setState({valueGet: _value}))
            this._addToLog("SimpleStorage.methods.get(console.log)");
        } else {
            console.log(SimpleStorage.methods);
            SimpleStorage.get()
                .then(_value => this.setState({valueGet: _value}));
            this._addToLog("SimpleStorage.get()");
        }
    }

    createAccount(e){
        e.preventDefault();

        var yearsOld = parseInt(this.state.yearsOldSet, 34);
        var name = this.state.nameSet;
        var description = this.state.descriptionSet;
        var gethAccount = web3.eth.defaultAccount || this.state.accountSet;

        console.log(web3.eth.defaultAccount || this.state.accountSet);

        // If web3.js 1.0 is being used
        if (EmbarkJS.isNewWeb3()) {
            window.EmbarkJS = EmbarkJS;
            window.DecentralizedSocialNetwork = DecentralizedSocialNetwork;
            DecentralizedSocialNetwork.methods.createAccount(yearsOld, name, description).send({from: gethAccount});
            this._addToLog("DecentralizedSocialNetwork.methods.createAccount(" + yearsOld + "," + name + "," + description + ")" +
                ".send({from: " + gethAccount + "})");
        } else {
            DecentralizedSocialNetwork.methods.createAccount(yearsOld, name, description);
            this._addToLog("DecentralizedSocialNetwork.methods.createAccount(" + yearsOld + "," + name + "," + description + ")");
        }
    }

    _addToLog(txt){
        this.state.logs.push(txt);
        this.setState({logs: this.state.logs});
    }

    render(){
        return (<React.Fragment>
                <h3> 1. Create an account</h3>
                <Form inline>
                    <FormGroup>
                        <FormControl
                            type="text"
                            defaultValue={this.state.yearsOldSet}
                            onChange={(e) => this.handleChange(e)} />
                        <FormControl
                            type="text"
                            defaultValue={this.state.nameSet}
                            onChange={(e) => this.handleChange(e)} />
                        <FormControl
                            type="text"
                            defaultValue={this.state.descriptionSet}
                            onChange={(e) => this.handleChange(e)} />
                        <Button bsStyle="primary" onClick={(e) => this.createAccount(e)}>Create Account</Button>
                        <HelpBlock>Once you set the value, the transaction will need to be mined and then the value will be updated on the blockchain.</HelpBlock>
                    </FormGroup>
                </Form>

                <h3> 2. Get the current value</h3>
                <Form inline>
                    <FormGroup>
                        <HelpBlock>current value is <span className="value">{this.state.valueGet}</span></HelpBlock>
                        <Button bsStyle="primary" onClick={(e) => this.getValue(e)}>Get Value</Button>
                        <HelpBlock>Click the button to get the current value. The initial value is 100.</HelpBlock>
                    </FormGroup>
                </Form>

                <h3> 3. Contract Calls </h3>
                <p>Javascript calls being made: </p>
                <div className="logs">
                    {
                        this.state.logs.map((item, i) => <p key={i}>{item}</p>)
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default DSN;