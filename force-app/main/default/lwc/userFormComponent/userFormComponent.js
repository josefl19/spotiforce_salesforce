import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import createUser from '@salesforce/apex/CreateUserController.createUser';
import alreadyExist from '@salesforce/apex/CreateUserController.alreadyExist';

import Id from '@salesforce/user/Id';

// For user
import LOCALE from '@salesforce/i18n/locale';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import LANGUAGE from '@salesforce/i18n/lang';
import CURRENCY from '@salesforce/i18n/currency';

export default class UserFormComponent extends LightningElement {
    @track firstName;
    @track lastName;
    @track username; 
    @track email;
    @track phone;
    @track passwd;
    @track confirm_passwd;
    @track showLoading = false;
    userId = Id;
    alias = null;
    locale = LOCALE;
    currency = CURRENCY.slice(0, -1);
    lang = LANGUAGE;
    //@track recordId;

    handleCreate(event) {
        console.log(event.detail);
        console.log(this.firstName && this.lastName && this.email && this.phone && this.passwd && this.confirm_passw && this.username)
        
        this.showLoading = true;
        
        if(this.firstName && this.lastName && this.email && this.phone && this.passwd && this.confirm_passwd && this.username) {
            if(this.passwd != this.confirm_passwd) {
                this.showLoading = false;
                this.dispatchEvent(new ShowToastEvent({
                        title:'Error',
                        message:'Entered passwords don\'t match. \nCheck the fields, please',
                        variant:'error'
                    }),
                );
                event.preventDefault();
                this.showLoading = false;
                return;
            } 
            
            let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
            if(emailCheck == null || emailCheck == undefined || emailCheck==false) {
                this.showLoading = false;
                this.dispatchEvent(new ShowToastEvent({
                        title:'Error',
                        message:'Please enter a valid email address',
                        variant:'error'
                    }),
                );
                this.showLoading = false;
                return;
            }
            
            let passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.passwd);
            if(passwordCheck == null || passwordCheck == undefined || passwordCheck == false){
                this.showLoading = false;
                this.dispatchEvent(new ShowToastEvent({
                        title:'Error',
                        message:'Password must be Minimum eight characters, at least one letter, one number and one special character',
                        variant:'error'
                    }),
                );
                this.showLoading = false;
                return;
            }

            event.preventDefault();
            
            alreadyExist({ username: this.username })
            .then( (result) => {
                console.log('login result---'+result, typeof result);
                if(result != null && result != undefined && result == true){
                    this.dispatchEvent(new ShowToastEvent({
                            title:'Error',
                            message:'Your username already exists somewhere on the Spotiforce',
                            variant:'error'
                        }),
                    );
                    this.showLoading = false;
                } else { 
                    console.log(this.firstName, this.lastName, this.username, this.email, this.phone, this.passwd);
                    createUser({firstName: this.firstName, lastName: this.lastName, username: this.username, email: this.email, phone: this.phone, passwd: this.passwd,
                                alias: this.alias, timeZone: TIME_ZONE, locale: LOCALE, lang: LANGUAGE})
                    .then((result) => {
                        console.log('Entrada a then de createUser')
                        if(result){                         
                            window.location.href = result;
                        }
                        this.showLoading = false;
                    }).catch((error) => {
                        console.log('Error en then')
                        this.error = error;
                        console.log('error-', error.body);
                        this.showLoading = false;

                        if(error && error.body && error.body.message){
                            this.dispatchEvent(new ShowToastEvent({
                                    title:'Error',
                                    message: error.body.message,
                                    variant:'error'
                                }),
                            );
                        }
                    });
                }
            }).catch((error) => {
                console.log('Catch de alreadyExist')
                this.error = error;
                if(error && error.body && error.body.message){
                    console.log('error msg-', error.body.message);
                }
                this.showLoading = false;
            });
        } else {
            this.dispatchEvent(new ShowToastEvent({
                    title:'Error',
                    message:'Complete all the fields to continue with register.',
                    variant:'error'
                }),
            );
        }
    }

    navigateToUserPage() {
        console.log('Hola desde Navigate');
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }

    onEmailInvalid(event){
        if (!event.target.validity.valid) {
            event.target.setCustomValidity('Enter a valid email address')
        }
    }

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleEmailChange(event) {
        if(event.target.value){
            this.email = event.target.value;
            this.username = this.email.split('@')[0] + '@spotiforce.com';
            this.alias = this.email.split('@')[0].slice(0, 5);
        } else {
            this.email = event.target.value;
            this.username = this.email.split('@')[0] + '@spotiforce.com';
            this.alias = this.email.split('@')[0].slice(0, 5);
        }
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handlePasswordChange(event) {
        this.passwd = event.target.value;
    }

    handleConfirmPasswordChange(event) {
        this.confirm_passwd = event.target.value;
    }
}