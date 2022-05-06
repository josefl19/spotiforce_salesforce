import { LightningElement, api, wire} from 'lwc';
import PURCHASE_FIELD from '@salesforce/schema/Account.Date_of_Purchase__c';
import EXPIRED_DATE_FIELD from '@salesforce/schema/Account.Expired_Date__c';
import EXPDATE_FIELD from '@salesforce/schema/User.ContactId';
import DATEPURCHASE_FIELD from '@salesforce/schema/User.Contact.Name';
import renewAvailable from '@salesforce/apex/AccountController.renewAvailable';
import updateSuscription from '@salesforce/apex/AccountController.updateSuscription';

import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import USER_ID from "@salesforce/user/Id";
import idAcc from '@salesforce/schema/User.AccountId';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


import getAccountByCommunityUser from '@salesforce/apex/AccountController.getAccountByCommunityUser';
import getAccountIdByCommunityUser from '@salesforce/apex/AccountController.getAccountIdByCommunityUser';

export default class RenovateSuscriptionComponent extends LightningElement {
    @api recordId;
    fieldsA = [PURCHASE_FIELD, EXPIRED_DATE_FIELD]
    userId = USER_ID;

    @wire(getAccountByCommunityUser, {Id: '$recordId' }) 
    account;

    @wire(getAccountIdByCommunityUser, {id: '$recordId'})
    idAccount;

    @wire(renewAvailable, {id: '$recordId'})
    available;

    get account() {
        return this.account.data.fields.Id.value;
    }

    get idAccount() {
        return this.idAccount.data.Id.value;
    }

    get available() {
        return this.available.data.Suscription_status__c.value;
    }

    handleClick(event) {
        updateSuscription({id: '$recordId'})
        .then((result) => {
            if(result != null){
                console.log(result);
            }
        }).catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                    title:'Error',
                    message: error.body.message,
                    variant:'error'
                }),
            );
        });
    }
}