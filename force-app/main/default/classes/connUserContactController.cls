public without sharing class connUserContactController {
    @AuraEnabled
    public static String getIdContact(String idUser) {
        try {
            String idContactUser;
            List<User> user = [SELECT ContactId FROM User WHERE Id =: idUser WITH SECURITY_ENFORCED LIMIT 1];
            for (User u : user) {
                idContactUser = u.ContactId;
            }

            return idContactUser;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean normalUser(String idUser){
        try {
            String idRecordTypeUser = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('User').getRecordTypeId();
            List<Contact> cont = [SELECT Id, RecordTypeId FROM Contact WHERE Id =: idUser WITH SECURITY_ENFORCED LIMIT 1];

            return idRecordTypeUser == cont[0].RecordTypeId;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean artistUser(String idUser){
        try {
            String idRecordTypeUser = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Artist').getRecordTypeId();
            List<Contact> cont = [SELECT Id, RecordTypeId FROM Contact WHERE Id =: idUser WITH SECURITY_ENFORCED LIMIT 1];

            return idRecordTypeUser == cont[0].RecordTypeId;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
