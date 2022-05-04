public without sharing class CreateUserController {
    
    @AuraEnabled
    public static String createUser( String firstName, String lastName, String username, String email, 
                                     String phone, String passwd, String alias, String timeZone, String locale, String lang ) {
        List<SObject> records = new List<SObject>();
        try {
            String accountId;
            Set<String> nicknames = new Set<String>();
            List<User> currentUser = [SELECT Id, CommunityNickname FROM User WHERE CommunityNickname != null];

            for(User u : currentUser) {
                nicknames.add(u.CommunityNickname);
            }

            // Asignar un nickname unico
            //String uniqueNickname;
            //if(nicknames.isEmpty()) {
            //    uniqueNickname = username + String.valueOf( Integer.valueOf(Math.random() * 10000));
            //} else {
                //for(Integer i=1; i <= 99 ; i++){
                 //   uniqueNickname = username + String.valueOf( Integer.valueOf(Math.random() * 10000));
                  //  if(!nicknames.contains(uniqueNickname)){
                  //      break;
                  //  }
               // }
            //}

            
            Account a = new Account();
            a.Name = firstName + ' ' + lastName;
            a.Email__c = email;
            a.Password__c = passwd;
            insert a;

            ID acctId = a.ID;
			Id userType = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('User').getRecordTypeId();
            Contact con = new Contact(
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Phone = phone,
                RecordTypeId = userType,
            	AccountId = acctId);
            insert con;
            
            Id standarUserProfileId = [SELECT Id FROM Profile WHERE Name = 'Customer Community User' LIMIT 1].Id;
            //Id localeId = [SELECT Id FROM Location WHERE Name =: locale LIMIT 1].Id;
            ID contId = con.Id;
            // Create new user
            User u = new User();
            u.FirstName = firstName;
            u.LastName = lastName;
            u.Username = username;
            u.Email = email;
            u.CommunityNickname = username + String.valueOf( Integer.valueOf(Math.random() * 10000));
            u.Alias = alias;
            u.TimeZoneSidKey = timeZone;
            u.LocaleSidKey = 'es_MX';
            u.LanguageLocaleKey = 'es';
            u.EmailEncodingKey = 'ISO-8859-1';
            u.ProfileId = standarUserProfileId;
            u.ContactId = contId;
            u.IsActive = true;
            u.PortalRole = 'Manager';
            insert u;

            String userId = Site.createPortalUser(u, accountId, passwd);
            if(userId != null) {
                String emailResult = sendWelcomeMail(u.Email, userId);

                if (passwd != null && passwd.length() > 1) {
                    ApexPages.PageReference pageRef = Site.login(username, passwd, null);
                    if(pageRef != null) return pageRef.getUrl();
                }
                else {
                    ApexPages.PageReference page = System.Page.SiteRegisterConfirm;
                    page.setRedirect(true);
                    return page.getUrl();
                }
            }
            //throw new CalloutException();
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            //return null; 
        }
    }
    
    @AuraEnabled
    public static string sendWelcomeMail(String email, String userId){
        try {
            String[] correos = new String[]{email} ;
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();         
            //mail.setSenderDisplayName(System.Label.Community_Email_Sender);
            mail.setTargetObjectId(userId);
            //mail.setTemplateId(welcomeTemplate[0].Id);
            //mail.setSaveAsActivity(false);
            mail.setToAddresses(correos);
            mail.setSubject('Cuenta creada satisfactoriamente!');
            mail.setPlainTextBody('Tu cuenta ha sido creada correctamente. Te damos la bienvenida');

            Messaging.sendEmail( new List<Messaging.SingleEmailMessage>{mail} );
            return 'success';
        } catch (Exception e) {            
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static boolean alreadyExist(String username){
        try {
            List<User> userList = [Select Id, Name From User Where Username = :username];
            //throw new CalloutException();
            return !userList.isEmpty();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            //return null;
        }
    }
}