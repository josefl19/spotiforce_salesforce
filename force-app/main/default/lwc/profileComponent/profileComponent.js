import { LightningElement, api } from 'lwc';
import normalUser from '@salesforce/apex/connUserContactController.normalUser';
import artistUser from '@salesforce/apex/connUserContactController.artistUser';

import USER_FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';
import USER_LASTNAME_FIELD from '@salesforce/schema/User.LastName';
import USER_EMAIL_FIELD from '@salesforce/schema/User.Email';
import USER_PHONE_FIELD from '@salesforce/schema/User.Phone';
import CONTACT_ID_FIELD from '@salesforce/schema/User.ContactId';
import ACCOUNTID_FIELD from '@salesforce/schema/User.AccountId';
import EXPDATE_FIELD from '@salesforce/schema/User.Contact.Email';
import DATEPURCHASE_FIELD from '@salesforce/schema/User.Contact.Name';

export default class ProfileComponent extends LightningElement {
    @api recordId;
    fields = [USER_FIRSTNAME_FIELD, USER_LASTNAME_FIELD, USER_EMAIL_FIELD, USER_PHONE_FIELD];
    fieldsA = [EXPDATE_FIELD, DATEPURCHASE_FIELD]
    contactId = CONTACT_ID_FIELD;
    @api accountId = ACCOUNTID_FIELD;
    is_User = false;
    is_Artist = false;


    isUser() {
        console.log('Hola')
        event.preventDefault();
        normalUser(this.contactId)
        .then((result) => {
            this.is_User = result
            return result;
        }).catch((error) => {
            console.log(error.body);
        });
    }

    isArtist() {
        event.preventDefault();
        artistUser(this.contactId)
        .then((result) => {
            console.log(result)
            return result;
        }).catch((error) => {
            console.log(error.body);
        });
    }
}