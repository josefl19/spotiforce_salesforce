import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class LoginComponent extends LightningElement {
    @track username;
    @track password;

    handleLogin(event) {
        console.log(this.username, this.password);
        if( this.username && this.password ) {
            event.preventDefault();

            startLogin({username: this.username, password: this.password})
            .then((result) => {
                console.log('En redireccion');
                console.log(result);
                //window.location.href = result;
            })
            .catch((error) => {
                console.log(error.body);
                this.dispatchEvent(new ShowToastEvent({
                        title:'Error',
                        message: error.body.message,
                        variant:'error'
                    }),
                );
            });
        } else {
            this.dispatchEvent(new ShowToastEvent({
                    title:'Error',
                    message: 'Compleate all the fields required',
                    variant:'error'
                }),
            );
        }
    }

    
    handleUserChange(event) {
        this.username = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }
}