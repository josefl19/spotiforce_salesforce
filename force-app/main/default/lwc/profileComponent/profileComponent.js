import { LightningElement, api } from 'lwc';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';

export default class ProfileComponent extends LightningElement {
    @api recordId;
    @api objectApiName;

    fields = [CONTACT_FIRSTNAME_FIELD, CONTACT_LASTNAME_FIELD, CONTACT_EMAIL_FIELD, CONTACT_PHONE_FIELD];
}