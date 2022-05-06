import { LightningElement, api } from 'lwc';
import ALBUM_FIELD from '@salesforce/schema/Song__c.Album__c';
import DURATION_FIELD from '@salesforce/schema/Song__c.Duration__c';
import SONGNAME_FIELD from '@salesforce/schema/Song__c.Name';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class UploadSongComponent extends LightningElement {
    @api objectApiName;
    fields = [ALBUM_FIELD, SONGNAME_FIELD, DURATION_FIELD];

    handleAccountCreated() {
        this.dispatchEvent(new ShowToastEvent({
                title:'Success',
                message: 'New song added successfully',
                variant: 'success'
            })
        );
    }
}