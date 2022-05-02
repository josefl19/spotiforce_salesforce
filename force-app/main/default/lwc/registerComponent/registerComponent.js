import { LightningElement, api, track } from 'lwc';

export default class RegisterComponent extends LightningElement {
    value = '';
    @track userVal = false;
    @track artistVal = false;

    get options() {
        return [
            { label: `I'm a User`, value: 'user' },
            { label: `I'm an Artist`, value: 'artist'},
        ];
    }

    handleChange(event) {     
        this.value = event.detail.value;        
        if (this.value == 'user'){
            this.userVal = true;
        }else{
            this.userVal = false;
        }
       
        if (this.value == 'artist'){
            this.artistVal = true;
        }else{
            this.artistVal = false;
        }
    }
}