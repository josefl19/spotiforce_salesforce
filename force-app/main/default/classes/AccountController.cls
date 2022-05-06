public with sharing class AccountController {
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccountByCommunityUser(String id) {
        Id communityUserContactId = [SELECT Id, Name, ContactId FROM User WHERE Id = :id].ContactId;
        Id userContact = [SELECT Id, AccountId FROM Contact WHERE Id = :communityUserContactId WITH SECURITY_ENFORCED].AccountId;
       return [SELECT Id, Name FROM Account WHERE Id = :userContact WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable = true)
    public static String getAccountIdByCommunityUser(String id) {
       try {
            String accountId;
            Id communityUserContactId = [SELECT Id, Name, ContactId FROM User WHERE Id = :id].ContactId;
            Id userContact = [SELECT Id, AccountId FROM Contact WHERE Id = :communityUserContactId WITH SECURITY_ENFORCED].AccountId;
            List<Account> acc = [SELECT Id FROM Account WHERE Id = :userContact WITH SECURITY_ENFORCED];

            for (Account a : acc) {
                accountId = a.Id;
            }

            return accountId;
       } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
       }
    }

    @AuraEnabled(cacheable = true)
    public static Boolean renewAvailable(String id){
        try {
            Boolean available;
            Id communityUserContactId = [SELECT Id, Name, ContactId FROM User WHERE Id = :id].ContactId;
            Id userContact = [SELECT Id, AccountId FROM Contact WHERE Id = :communityUserContactId WITH SECURITY_ENFORCED].AccountId;
            List<Account> acc = [SELECT Id, Suscription_status__c FROM Account WHERE Id = :userContact WITH SECURITY_ENFORCED];
            
            for (Account a : acc) {
                if(a.Suscription_status__c == 'Active') {
                    available = false;
                } else {
                    available = true;
                }
            }

            return available;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static String updateSuscription(String id){
        try {
            Id communityUserContactId = [SELECT ContactId FROM User WHERE Id=:id].ContactId;
            

            return String.valueOf(communityUserContactId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
 }